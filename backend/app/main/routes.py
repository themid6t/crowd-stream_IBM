import os
from . import main_blueprint
from flask import request, jsonify, send_from_directory, current_app, url_for
from werkzeug.utils import secure_filename
from app.models import db, User, Movie
from app.tasks import process_video_task
from datetime import datetime, timezone
import uuid
# from app.utils.clerk_auth import clerk_protected_route

# Added helper functions for file extension validation
def allowed_thumbnail(filename):
    """Check if the uploaded thumbnail file has an allowed extension"""
    ALLOWED_THUMBNAIL_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_THUMBNAIL_EXTENSIONS

def allowed_movie(filename):
    """Check if the uploaded movie file has an allowed extension"""
    ALLOWED_MOVIE_EXTENSIONS = {'mp4', 'mkv', 'avi', 'mov'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_MOVIE_EXTENSIONS

MOVIE_FOLDER = 'app/static/uploads'  # Keep uploads inside static
THUMBNAIL_FOLDER = 'app/static/thumbnail'  # Keep uploads inside static
HLS_FOLDER = 'app/static/streams'     # HLS streams are now in static


@main_blueprint.route('/list', methods=['GET'])
def list_movies():
    movies = Movie.query.all()
    movie_list = []
    for movie in movies:
        if movie.status != "pending":
            
            # Create a full URL for the thumbnail
            thumbnail_url = movie.thumbnail_url
            if not thumbnail_url.startswith(('http://', 'https://')):
                thumbnail_url = url_for('static', filename=thumbnail_url.replace('/static/', ''), _external=True)
                
            movie_list.append({
                "id": movie.id,
                "thumbnailUrl": thumbnail_url,
                "title": movie.title,
                "duration": movie.duration,
                "createAt": movie.created_at,
            })
        
    return jsonify(movie_list), 200

# POST /jobs
@main_blueprint.route('/upload', methods=['POST'])
def upload():
    try:
        # Check if required files exist
        if 'thumbnail' not in request.files or 'movie' not in request.files:
            return jsonify({'message': 'Missing required files'}), 400
        
        thumbnail_file = request.files['thumbnail']
        movie_file = request.files['movie']
        
        # Check for empty filenames
        if thumbnail_file.filename == '' or movie_file.filename == '':
            return jsonify({'message': 'No selected file'}), 400
        
        # Check file extensions
        if not allowed_thumbnail(thumbnail_file.filename):
            return jsonify({'message': 'Invalid thumbnail format. Allowed formats: png, jpg, jpeg, gif'}), 400
        
        if not allowed_movie(movie_file.filename):
            return jsonify({'message': 'Invalid movie format. Allowed formats: mp4, mkv, avi, mov'}), 400
        
        # Get form data
        title = request.form.get('title', '')                   # Add to db
        description = request.form.get('description', '')       # Add to db
        
        if not title:
            return jsonify({'message': 'Movie title is required'}), 400
        
        # Generate unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")   
        unique_id = str(uuid.uuid4().hex[:8])                   # Add to db <pk>
        createdAt = datetime.now(timezone.utc).isoformat()+'Z'

        # Ensure these directories exist
        os.makedirs(MOVIE_FOLDER, exist_ok=True)
        os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)
        os.makedirs(HLS_FOLDER, exist_ok=True)
        
        # Save thumbnail
        thumbnail_extension = thumbnail_file.filename.rsplit('.', 1)[1].lower()
        thumbnail_filename = f"{unique_id}_{timestamp}.{thumbnail_extension}"
        thumbnail_path = os.path.join(THUMBNAIL_FOLDER, thumbnail_filename)     # Add to db
        thumbnail_file.save(thumbnail_path)
        
        # Save movie file
        movie_extension = movie_file.filename.rsplit('.', 1)[1].lower()
        movie_filename = f"{unique_id}_{timestamp}.{movie_extension}"
        movie_path = os.path.join(MOVIE_FOLDER, movie_filename)
        movie_file.save(movie_path)
        
        # Here you would typically save metadata to a database
        # For simplicity, this example just returns success message

        # Create a new movie record
        new_video = Movie(
            id=unique_id,
            title=title,
            description=description,
            created_at=createdAt,
            thumbnail_url=f"/static/thumbnail/{thumbnail_filename}",  # Use proper URL path
            uploaded_by="admin",
        )
        db.session.add(new_video)
        db.session.commit()

        # Trigger the Celery task
        task = process_video_task.apply_async(args=(new_video.id, movie_path, HLS_FOLDER))
        
        return jsonify({
            'message': 'Upload successful',
            'movie': {
                'id': unique_id,
                'title': title,
                'description': description,
                'thumbnail_path': thumbnail_filename,
                'movie_path': movie_filename
            }
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Error uploading movie: {str(e)}'}), 500


@main_blueprint.route('/stream/<movie_id>', methods=['GET'])
def get_job_status(movie_id):
    current_app.logger.info(f"Fetching HLS URL for movie ID {movie_id}")
    movie = Movie.query.get(movie_id)
    if movie:
        current_app.logger.info(f"Movie found: {movie.title}")

        # Create a full URL for the thumbnail
        thumbnail_url = movie.thumbnail_url
        if not thumbnail_url.startswith(('http://', 'https://')):
            thumbnail_url = url_for('static', filename=thumbnail_url.replace('/static/', ''), _external=True)

        hls_url = movie.hls_url
        if hls_url and not hls_url.startswith(('http://', 'https://')):
            cleaned_path = hls_url.replace('/static/', '').replace('\\', '/')
            hls_url = url_for('static', filename=cleaned_path, _external=True)

        return jsonify({
            "thumbnailUrl": thumbnail_url,
            "streamUrl": hls_url,
            "title": movie.title,
            "createdAt": movie.created_at,
            "duration": movie.duration, 
            "description": movie.description,
        }), 200
    
    current_app.logger.error(f"Movie not found with ID {movie_id}")
    return jsonify({"message": "Movie not found"}), 404

@main_blueprint.route('/hls/<path:filename>')
def serve_hls(filename):
    # current_app.logger.info(f"Serving HLS file: {filename}")
    stream_dir = os.path.join(os.getcwd(), "streams")  # Full path to streams/
    return send_from_directory(stream_dir, filename)
