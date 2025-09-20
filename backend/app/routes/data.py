from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import pandas as pd
import os
import uuid
from datetime import datetime
from app import db
from app.models import User, Project, DataUpload
from app.config import Config

data_bp = Blueprint('data', __name__)

ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def analyze_dataset(file_path, file_type):
    """Analyze uploaded dataset and return summary statistics"""
    try:
        # Read data based on file type
        if file_type == 'csv':
            df = pd.read_csv(file_path)
        elif file_type in ['xlsx', 'xls']:
            df = pd.read_excel(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
        
        # Basic dataset information
        row_count, column_count = df.shape
        column_names = df.columns.tolist()
        column_types = df.dtypes.astype(str).to_dict()
        
        # Generate summary statistics
        summary = {
            'numeric_columns': [],
            'categorical_columns': [],
            'missing_values': df.isnull().sum().to_dict(),
            'data_types': column_types
        }
        
        # Analyze numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns
        for col in numeric_cols:
            col_summary = {
                'column': col,
                'count': int(df[col].count()),
                'mean': float(df[col].mean()) if not df[col].empty else None,
                'std': float(df[col].std()) if not df[col].empty else None,
                'min': float(df[col].min()) if not df[col].empty else None,
                'max': float(df[col].max()) if not df[col].empty else None,
                'median': float(df[col].median()) if not df[col].empty else None,
                'quartiles': {
                    'q1': float(df[col].quantile(0.25)) if not df[col].empty else None,
                    'q3': float(df[col].quantile(0.75)) if not df[col].empty else None
                }
            }
            summary['numeric_columns'].append(col_summary)
        
        # Analyze categorical columns
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns
        for col in categorical_cols:
            col_summary = {
                'column': col,
                'unique_count': int(df[col].nunique()),
                'most_frequent': df[col].mode().iloc[0] if not df[col].mode().empty else None,
                'top_values': df[col].value_counts().head(5).to_dict()
            }
            summary['categorical_columns'].append(col_summary)
        
        return {
            'row_count': row_count,
            'column_count': column_count,
            'column_names': column_names,
            'column_types': column_types,
            'summary': summary
        }
        
    except Exception as e:
        raise Exception(f"Failed to analyze dataset: {str(e)}")


@data_bp.route('/upload/<int:project_id>', methods=['POST'])
@jwt_required()
def upload_data(project_id):
    """Upload CSV/Excel data to a project"""
    try:
        current_user_id = get_jwt_identity()
        
        # Verify project ownership
        project = Project.query.filter_by(id=project_id, user_id=current_user_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload CSV or Excel files.'}), 400
        
        # Get additional metadata
        description = request.form.get('description', '')
        upload_stage = request.form.get('upload_stage', project.current_stage)
        is_primary = request.form.get('is_primary', 'false').lower() == 'true'
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(Config.UPLOAD_FOLDER, unique_filename)
        
        # Save file
        file.save(file_path)
        file_size = os.path.getsize(file_path)
        
        # Analyze dataset
        try:
            analysis_result = analyze_dataset(file_path, file_extension)
        except Exception as e:
            # Clean up file if analysis fails
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': f'Dataset analysis failed: {str(e)}'}), 400
        
        # If this is set as primary, update other uploads
        if is_primary:
            DataUpload.query.filter_by(project_id=project_id).update({'is_primary': False})
        
        # Create database record
        data_upload = DataUpload(
            project_id=project_id,
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=file_size,
            file_type=file_extension,
            row_count=analysis_result['row_count'],
            column_count=analysis_result['column_count'],
            column_names=analysis_result['column_names'],
            column_types=analysis_result['column_types'],
            data_summary=analysis_result['summary'],
            upload_stage=upload_stage,
            description=description,
            is_primary=is_primary
        )
        
        db.session.add(data_upload)
        db.session.commit()
        
        return jsonify({
            'message': 'File uploaded successfully',
            'data_upload': data_upload.to_dict(),
            'analysis': analysis_result
        }), 201
        
    except Exception as e:
        db.session.rollback()
        # Clean up file if database operation fails
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        return jsonify({'error': 'Upload failed', 'details': str(e)}), 500


@data_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_data(project_id):
    """Get all data uploads for a project"""
    try:
        current_user_id = get_jwt_identity()
        
        # Verify project ownership
        project = Project.query.filter_by(id=project_id, user_id=current_user_id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        data_uploads = DataUpload.query.filter_by(project_id=project_id).order_by(DataUpload.created_at.desc()).all()
        
        return jsonify({
            'data_uploads': [upload.to_dict() for upload in data_uploads]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get project data', 'details': str(e)}), 500


@data_bp.route('/upload/<int:upload_id>', methods=['GET'])
@jwt_required()
def get_data_upload(upload_id):
    """Get specific data upload details"""
    try:
        current_user_id = get_jwt_identity()
        
        data_upload = DataUpload.query.join(Project).filter(
            DataUpload.id == upload_id,
            Project.user_id == current_user_id
        ).first()
        
        if not data_upload:
            return jsonify({'error': 'Data upload not found'}), 404
        
        return jsonify({
            'data_upload': data_upload.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get data upload', 'details': str(e)}), 500


@data_bp.route('/upload/<int:upload_id>/data', methods=['GET'])
@jwt_required()
def get_data_preview(upload_id):
    """Get preview of uploaded data"""
    try:
        current_user_id = get_jwt_identity()
        
        data_upload = DataUpload.query.join(Project).filter(
            DataUpload.id == upload_id,
            Project.user_id == current_user_id
        ).first()
        
        if not data_upload:
            return jsonify({'error': 'Data upload not found'}), 404
        
        # Get query parameters
        limit = int(request.args.get('limit', 100))
        offset = int(request.args.get('offset', 0))
        
        # Read data
        if data_upload.file_type == 'csv':
            df = pd.read_csv(data_upload.file_path, skiprows=offset, nrows=limit)
        elif data_upload.file_type in ['xlsx', 'xls']:
            df = pd.read_excel(data_upload.file_path, skiprows=offset, nrows=limit)
        else:
            return jsonify({'error': 'Unsupported file type'}), 400
        
        # Convert to JSON format
        data = df.to_dict(orient='records')
        
        return jsonify({
            'data': data,
            'columns': df.columns.tolist(),
            'total_rows': data_upload.row_count,
            'showing_rows': len(data),
            'offset': offset
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get data preview', 'details': str(e)}), 500


@data_bp.route('/upload/<int:upload_id>/download', methods=['GET'])
@jwt_required()
def download_data(upload_id):
    """Download original uploaded file"""
    try:
        current_user_id = get_jwt_identity()
        
        data_upload = DataUpload.query.join(Project).filter(
            DataUpload.id == upload_id,
            Project.user_id == current_user_id
        ).first()
        
        if not data_upload:
            return jsonify({'error': 'Data upload not found'}), 404
        
        if not os.path.exists(data_upload.file_path):
            return jsonify({'error': 'File not found on server'}), 404
        
        return send_file(
            data_upload.file_path,
            as_attachment=True,
            download_name=data_upload.original_filename
        )
        
    except Exception as e:
        return jsonify({'error': 'Failed to download file', 'details': str(e)}), 500


@data_bp.route('/upload/<int:upload_id>', methods=['DELETE'])
@jwt_required()
def delete_data_upload(upload_id):
    """Delete a data upload"""
    try:
        current_user_id = get_jwt_identity()
        
        data_upload = DataUpload.query.join(Project).filter(
            DataUpload.id == upload_id,
            Project.user_id == current_user_id
        ).first()
        
        if not data_upload:
            return jsonify({'error': 'Data upload not found'}), 404
        
        # Delete file from filesystem
        if os.path.exists(data_upload.file_path):
            os.remove(data_upload.file_path)
        
        # Delete database record
        db.session.delete(data_upload)
        db.session.commit()
        
        return jsonify({
            'message': 'Data upload deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete data upload', 'details': str(e)}), 500