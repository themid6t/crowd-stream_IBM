from flask_sqlalchemy import SQLAlchemy
from flask import current_app
import uuid

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True)  # String UUID for Clerk users
    email = db.Column(db.String(80), unique=True, nullable=False, index=True)

    # Relationship (User → Movies)
    movies = db.relationship('Movie', backref='uploader', lazy=True, cascade="all, delete")

    def __repr__(self):
        return f'<User {self.email}>'

class Movie(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text)
    thumbnail_url = db.Column(db.String(255))
    created_at = db.Column(db.String(20))
    status = db.Column(db.String(20), default='pending')
    
    duration = db.Column(db.Float, default=0.0)
    hls_url = db.Column(db.String(255))  # Increased length to 255 for URLs
    s3_url = db.Column(db.String(255))
    
    # Foreign key with relationship
    uploaded_by = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Movie {self.title}>'
