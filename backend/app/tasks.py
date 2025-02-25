import os, subprocess
from app.models import db, Movie
from flask import current_app
from . import celery

@celery.task(bind=True)
def process_video_task(self, movie_id, file_path, hls_folder):
    try:
        job = Movie.query.get(movie_id)
        if not job:
            raise ValueError(f"Movie ID {movie_id} not found")
        
        job.status = "in_progress"
        db.session.commit()
        current_app.logger.info(f"Movie ID {movie_id} status updated to in_progress")

        output_dir = os.path.join(hls_folder, str(movie_id))
        os.makedirs(output_dir, exist_ok=True)
        current_app.logger.info(f"Output directory created at {output_dir}")

        hls_playlist = os.path.join(f"static/streams/{movie_id}", "output.m3u8")
        
        command = [
            "ffmpeg", "-i", file_path,  # Input file
            "-profile:v", "baseline",  # H.264 Baseline Profile for compatibility
            "-level", "3.0",
            "-start_number", "0",  # Start segment numbering from 0
            "-hls_time", "10",  # Each segment duration (in seconds)
            "-hls_list_size", "0",  # Keep all segments in the playlist
            "-f", "hls",  # Output format
            os.path.join(output_dir, "output.m3u8")  # Output playlist file
        ]

        current_app.logger.info(f"Running command: {' '.join(command)}")
        subprocess.run(command, check=True)

        if not os.path.exists(os.path.join(output_dir, "output.m3u8")):
            current_app.logger.error(f"Failed to generate HLS playlist for movie ID {movie_id}")
            return f"Failed to generate HLS playlist for movie ID {movie_id}"
        
        if os.path.exists(file_path):
            os.remove(file_path)
            current_app.logger.info(f"Deleted file: {file_path}")
        else:
            current_app.logger.warning(f"File not found: {file_path}")

        job.hls_url = f"/{hls_playlist}"
        job.status = "completed"
        db.session.commit()
        current_app.logger.info(f"Movie ID {movie_id} processed successfully")

        return f"Movie ID {movie_id} processed successfully"
    
    except subprocess.CalledProcessError as e:
        current_app.logger.error(f"Error during HLS processing for movie ID {movie_id}: {e}")
        return f"Error during HLS processing: {movie_id}: {e}"

    except Exception as e:
        # Update job status to 'failed' with error message
        job = Movie.query.get(movie_id)
        if job:
            job.status = "failed"
            job.error_message = str(e)
            db.session.commit()
            current_app.logger.error(f"Movie ID {movie_id} processing failed: {e}")

        # Re-raise the exception to let Celery handle it (e.g., retries, logging)
        raise