from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, date
from app import db
from app.models import User, Project

projects_bp = Blueprint('projects', __name__)


class ProjectCreateSchema(Schema):
    """Schema for project creation validation"""
    title = fields.Str(required=True, validate=lambda x: len(x.strip()) > 0)
    description = fields.Str(missing=None)
    problem_statement = fields.Str(missing=None)
    project_goals = fields.Str(missing=None)
    project_scope = fields.Str(missing=None)
    stakeholders = fields.Str(missing=None)
    start_date = fields.Date(missing=None)
    target_completion_date = fields.Date(missing=None)


class ProjectUpdateSchema(Schema):
    """Schema for project update validation"""
    title = fields.Str(validate=lambda x: len(x.strip()) > 0)
    description = fields.Str()
    current_stage = fields.Str(validate=lambda x: x in ['define', 'measure', 'analyze', 'improve', 'control'])
    status = fields.Str(validate=lambda x: x in ['active', 'completed', 'on_hold', 'cancelled'])
    problem_statement = fields.Str()
    project_goals = fields.Str()
    project_scope = fields.Str()
    stakeholders = fields.Str()
    sipoc_data = fields.Dict()
    success_metrics = fields.Str()
    baseline_data = fields.Dict()
    root_causes = fields.Dict()
    hypothesis_results = fields.Dict()
    improvement_ideas = fields.Dict()
    improvement_plan = fields.Str()
    control_plan = fields.Str()
    monitoring_metrics = fields.Dict()
    start_date = fields.Date()
    target_completion_date = fields.Date()
    actual_completion_date = fields.Date()


@projects_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    """Create a new DMAIC project"""
    try:
        current_user_id = get_jwt_identity()
        
        # Validate input data
        schema = ProjectCreateSchema()
        data = schema.load(request.json)
        
        # Create new project
        project = Project(
            title=data['title'],
            description=data.get('description'),
            user_id=current_user_id,
            problem_statement=data.get('problem_statement'),
            project_goals=data.get('project_goals'),
            project_scope=data.get('project_scope'),
            stakeholders=data.get('stakeholders'),
            start_date=data.get('start_date'),
            target_completion_date=data.get('target_completion_date')
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'message': 'Project created successfully',
            'project': project.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation failed', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create project', 'details': str(e)}), 500


@projects_bp.route('', methods=['GET'])
@jwt_required()
def get_projects():
    """Get all projects for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get query parameters
        stage = request.args.get('stage')
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Build query
        query = Project.query.filter_by(user_id=current_user_id)
        
        if stage:
            query = query.filter_by(current_stage=stage)
        if status:
            query = query.filter_by(status=status)
        
        # Paginate results
        projects = query.order_by(Project.updated_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'projects': [project.to_dict() for project in projects.items],
            'pagination': {
                'page': projects.page,
                'pages': projects.pages,
                'per_page': projects.per_page,
                'total': projects.total,
                'has_next': projects.has_next,
                'has_prev': projects.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get projects', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    """Get a specific project"""
    try:
        current_user_id = get_jwt_identity()
        
        project = Project.query.filter_by(id=project_id, user_id=current_user_id).first()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        return jsonify({
            'project': project.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get project', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Update a specific project"""
    try:
        current_user_id = get_jwt_identity()
        
        project = Project.query.filter_by(id=project_id, user_id=current_user_id).first()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Validate input data
        schema = ProjectUpdateSchema()
        data = schema.load(request.json)
        
        # Update project fields
        for field, value in data.items():
            if hasattr(project, field):
                setattr(project, field, value)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Project updated successfully',
            'project': project.to_dict()
        }), 200
        
    except ValidationError as e:
        return jsonify({'error': 'Validation failed', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update project', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Delete a specific project"""
    try:
        current_user_id = get_jwt_identity()
        
        project = Project.query.filter_by(id=project_id, user_id=current_user_id).first()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({
            'message': 'Project deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete project', 'details': str(e)}), 500


@projects_bp.route('/<int:project_id>/stage', methods=['PUT'])
@jwt_required()
def update_project_stage(project_id):
    """Update the current stage of a project"""
    try:
        current_user_id = get_jwt_identity()
        
        project = Project.query.filter_by(id=project_id, user_id=current_user_id).first()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        data = request.json
        new_stage = data.get('stage')
        
        if not new_stage or new_stage not in ['define', 'measure', 'analyze', 'improve', 'control']:
            return jsonify({'error': 'Invalid stage'}), 400
        
        project.current_stage = new_stage
        db.session.commit()
        
        return jsonify({
            'message': f'Project stage updated to {new_stage}',
            'project': project.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update project stage', 'details': str(e)}), 500


@projects_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_projects_summary():
    """Get summary statistics for user's projects"""
    try:
        current_user_id = get_jwt_identity()
        
        projects = Project.query.filter_by(user_id=current_user_id).all()
        
        summary = {
            'total_projects': len(projects),
            'by_stage': {
                'define': 0,
                'measure': 0,
                'analyze': 0,
                'improve': 0,
                'control': 0
            },
            'by_status': {
                'active': 0,
                'completed': 0,
                'on_hold': 0,
                'cancelled': 0
            }
        }
        
        for project in projects:
            summary['by_stage'][project.current_stage] += 1
            summary['by_status'][project.status] += 1
        
        return jsonify(summary), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get projects summary', 'details': str(e)}), 500