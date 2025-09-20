from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    """User model for authentication and project ownership"""
    
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    company = db.Column(db.String(100))
    role = db.Column(db.String(50))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    projects = db.relationship('Project', backref='owner', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary (excluding sensitive data)"""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'company': self.company,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<User {self.email}>'


class Project(db.Model):
    """DMAIC Project model"""
    
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # DMAIC Stage tracking
    current_stage = db.Column(db.String(20), default='define')  # define, measure, analyze, improve, control
    
    # Define stage data
    problem_statement = db.Column(db.Text)
    project_goals = db.Column(db.Text)
    project_scope = db.Column(db.Text)
    stakeholders = db.Column(db.Text)
    sipoc_data = db.Column(db.JSON)  # Store SIPOC diagram data
    
    # Measure stage data
    success_metrics = db.Column(db.Text)
    baseline_data = db.Column(db.JSON)
    
    # Analyze stage data
    root_causes = db.Column(db.JSON)  # Store fishbone and 5 whys data
    hypothesis_results = db.Column(db.JSON)
    
    # Improve stage data
    improvement_ideas = db.Column(db.JSON)
    improvement_plan = db.Column(db.Text)
    
    # Control stage data
    control_plan = db.Column(db.Text)
    monitoring_metrics = db.Column(db.JSON)
    
    # Project metadata
    start_date = db.Column(db.Date)
    target_completion_date = db.Column(db.Date)
    actual_completion_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='active')  # active, completed, on_hold, cancelled
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    data_uploads = db.relationship('DataUpload', backref='project', lazy='dynamic', cascade='all, delete-orphan')
    analyses = db.relationship('Analysis', backref='project', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert project to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'current_stage': self.current_stage,
            'status': self.status,
            'problem_statement': self.problem_statement,
            'project_goals': self.project_goals,
            'project_scope': self.project_scope,
            'stakeholders': self.stakeholders,
            'sipoc_data': self.sipoc_data,
            'success_metrics': self.success_metrics,
            'baseline_data': self.baseline_data,
            'root_causes': self.root_causes,
            'hypothesis_results': self.hypothesis_results,
            'improvement_ideas': self.improvement_ideas,
            'improvement_plan': self.improvement_plan,
            'control_plan': self.control_plan,
            'monitoring_metrics': self.monitoring_metrics,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'target_completion_date': self.target_completion_date.isoformat() if self.target_completion_date else None,
            'actual_completion_date': self.actual_completion_date.isoformat() if self.actual_completion_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'owner': self.owner.to_dict() if self.owner else None
        }
    
    def __repr__(self):
        return f'<Project {self.title}>'


class DataUpload(db.Model):
    """Data upload and dataset management"""
    
    __tablename__ = 'data_uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)
    file_type = db.Column(db.String(50))
    
    # Data characteristics
    row_count = db.Column(db.Integer)
    column_count = db.Column(db.Integer)
    column_names = db.Column(db.JSON)
    column_types = db.Column(db.JSON)
    data_summary = db.Column(db.JSON)  # Basic statistics
    
    # Upload metadata
    upload_stage = db.Column(db.String(20))  # Which DMAIC stage this data belongs to
    description = db.Column(db.Text)
    is_primary = db.Column(db.Boolean, default=False)  # Is this the main dataset for the project
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert data upload to dictionary"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'row_count': self.row_count,
            'column_count': self.column_count,
            'column_names': self.column_names,
            'column_types': self.column_types,
            'data_summary': self.data_summary,
            'upload_stage': self.upload_stage,
            'description': self.description,
            'is_primary': self.is_primary,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<DataUpload {self.original_filename}>'


class Analysis(db.Model):
    """Store analysis results and configurations"""
    
    __tablename__ = 'analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    data_upload_id = db.Column(db.Integer, db.ForeignKey('data_uploads.id'))
    
    # Analysis metadata
    analysis_type = db.Column(db.String(50), nullable=False)  # descriptive, anova, regression, control_chart, etc.
    analysis_name = db.Column(db.String(100))
    dmaic_stage = db.Column(db.String(20))
    
    # Analysis configuration and parameters
    configuration = db.Column(db.JSON)  # Store analysis parameters
    
    # Results
    results = db.Column(db.JSON)  # Store analysis results
    charts = db.Column(db.JSON)  # Store chart file paths and metadata
    summary = db.Column(db.Text)  # Plain-English summary
    
    # Status
    status = db.Column(db.String(20), default='pending')  # pending, running, completed, failed
    error_message = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    data_upload = db.relationship('DataUpload', backref='analyses')
    
    def to_dict(self):
        """Convert analysis to dictionary"""
        return {
            'id': self.id,
            'project_id': self.project_id,
            'data_upload_id': self.data_upload_id,
            'analysis_type': self.analysis_type,
            'analysis_name': self.analysis_name,
            'dmaic_stage': self.dmaic_stage,
            'configuration': self.configuration,
            'results': self.results,
            'charts': self.charts,
            'summary': self.summary,
            'status': self.status,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Analysis {self.analysis_type} for Project {self.project_id}>'