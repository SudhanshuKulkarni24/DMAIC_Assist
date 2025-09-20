import os
from datetime import timedelta


class Config:
    """Base configuration class"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # JWT settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Database settings
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://dmaic_user:dmaic_password@localhost/dmaic_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Redis settings
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # File upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # CORS settings
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Chart generation settings
    CHART_DPI = 300
    CHART_FORMAT = 'png'
    
    # Report settings
    REPORTS_FOLDER = os.path.join(UPLOAD_FOLDER, 'reports')
    
    @staticmethod
    def init_app(app):
        """Initialize application-specific configuration"""
        # Create upload folders if they don't exist
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.REPORTS_FOLDER, exist_ok=True)


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Use environment variables in production
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        Config.SQLALCHEMY_DATABASE_URI


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}