
### Endpoints
```/jobs```: Accepts user input (prompt, duration, template) and triggers the processing.
```/status/<job_id>/status```: Returns the current status of a job.
```/download/<job_id>/download```: Allows users to download the final video once ready.


### Requirements - 
```bash
    # preinstall mini-conda and create environment
    conda create --name ytauto python==3.11.11

    conda activate ytauto
    pip install -r requirements.txt
```
```bash
# On macOS (using Homebrew)
brew install redis

# On Ubuntu/Debian
sudo apt-get update
sudo apt-get install redis-server

# On Windows
# Download from official Redis website or use Windows Subsystem for Linux (WSL)
```

#### Activate the conda environment before running the server
### Run - 

#### Start redis-server
```bash
    ## cd backend
    # macOS
    brew services start redis

    # Ubuntu/Debian
    sudo systemctl start redis-server

    # Manual start
    redis-server
```

#### Start celery worker
```bash
    ## cd into backend
    celery -A celery_worker.celery worker --pool=solo --loglevel=info
```

#### Run the flask app
```bash
    export FLASK_APP=app  # Only once at the begining
    flask run # to run the server
```

