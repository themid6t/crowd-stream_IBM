import os
from . import main_blueprint
from flask import request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
from app.models import db, User, Movie
from app.tasks import process_video_task
# from app.utils.clerk_auth import clerk_protected_route

UPLOAD_FOLDER = 'app/static/uploads'  # Keep uploads inside static
HLS_FOLDER = 'app/static/streams'     # HLS streams are now in static


@main_blueprint.route('/list', methods=['GET'])
def list_movies():
    current_app.logger.info("Fetching all movies")
    movies = Movie.query.all()
    movie_list = []
    for movie in movies:
        movie_list.append({
            "id": movie.id,
            "title": movie.title,
            "hls_url": movie.hls_url
        })
        
    return jsonify(movie_list), 200

# POST /jobs
@main_blueprint.route('/upload', methods=['POST'])
def upload():
    current_app.logger.info("Uploading file")
    if 'file' not in request.files:
        current_app.logger.error("No file part")
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    title = request.form.get('title')  # Use request.form for text fields

    if not file or not title:
        current_app.logger.error("Missing required fields")
        return jsonify({"error": "Missing required fields"}), 400
    
    # Save the file to the server
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    current_app.logger.info(f"File saved to {file_path} temporarily")

    # Create a new movie record
    new_video = Movie(
        title=title,
        uploaded_by="admin",
    )
    db.session.add(new_video)
    db.session.commit()
    current_app.logger.info(f"New movie record created with ID {new_video.id}")

    # Trigger the Celery task
    task = process_video_task.apply_async(args=(new_video.id, file_path, HLS_FOLDER))
    current_app.logger.info(f"Processing task started with task ID {task.id}")
    # new_video.task_id = task.id
    # db.session.commit()
    
    return jsonify({"message": "Processing started"}), 202


@main_blueprint.route('/stream/<movie_id>', methods=['GET'])
def get_job_status(movie_id):
    current_app.logger.info(f"Fetching HLS URL for movie ID {movie_id}")
    movie = Movie.query.get(movie_id)
    if movie:
        current_app.logger.info(f"Movie found: {movie.title}")
        return jsonify({"hls_url": movie.hls_url}), 200
    
    current_app.logger.error(f"Movie not found with ID {movie_id}")
    return jsonify({"message": "Movie not found"}), 404

@main_blueprint.route('/hls/<path:filename>')
def serve_hls(filename):
    # current_app.logger.info(f"Serving HLS file: {filename}")
    stream_dir = os.path.join(os.getcwd(), "streams")  # Full path to streams/
    return send_from_directory(stream_dir, filename)