# CrowdStream Backend Setup Guide

This guide will help you set up the CrowdStream backend with Redis running in WSL2 and the Flask application running in Windows.

## Prerequisites

- Windows 10/11 with WSL2 installed
- Ubuntu on WSL2
- Python 3.8+ on Windows
- Redis installed on WSL2
- PostgreSQL installed (either on Windows or WSL2)

## Setup Instructions

### 1. WSL2 Setup for Redis

#### Install Redis on WSL2
```bash
# Open your Ubuntu WSL terminal
sudo apt update
sudo apt install redis-server
```

#### Configure Redis
```bash
# Edit Redis configuration
sudo nano /etc/redis/redis.conf
```

- Find the `bind 127.0.0.1 ::1` line and modify it to: `bind 0.0.0.0`
- Set `protected-mode no`
- Save and exit

#### Restart Redis Server
```bash
sudo service redis-server restart
```

#### Find WSL2 IP Address
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```
Note down the IP address (typically 172.x.x.x) - you'll need it for the .env file

### 2. Windows Backend Setup

#### Clone Repository (if not already done)
```bash
git clone <repository-url>
cd crowd-stream_IBM/backend
```

#### Create and Activate Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the backend directory by copying `.env.sample`:
```bash
copy .env.sample .env
```

Edit the `.env` file with your specific settings, particularly:
- Set the `CELERY_BROKER_URL` to point to your WSL2 Redis instance
- Configure your database connection strings

### 3. Start the Application

#### Start Redis in WSL2
```bash
# In WSL terminal
sudo service redis-server start
```

#### Run Flask Application (Windows)
```bash
# In Windows terminal, with venv activated
flask run
```

#### Run Celery Worker (Windows, in a separate terminal)
```bash
# In Windows terminal, with venv activated
celery -A celery_worker.celery worker --loglevel=info --pool=solo
```

## Application Structure

- `application.py`: Main entry point for the Flask application
- `celery_worker.py`: Entry point for Celery workers
- `config.py`: Configuration settings for different environments
- `app/`: Core application package
  - `__init__.py`: Application factory
  - `models.py`: Database models
  - `main/`: Main application routes
  - `auth/`: Authentication related routes

## Troubleshooting

### Common Issues

1. **Cannot connect to Redis**:
   - Verify Redis is running: `sudo service redis-server status`
   - Check WSL2 IP: `ip addr show`
   - Ensure the Redis configuration allows remote connections

2. **Celery worker won't start**:
   - Ensure Redis URL is correct in `.env`
   - Try running with `--concurrency=1` flag

3. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check connection string in `.env`

### Logs

Check logs in the `logs/` directory for more detailed error information.