from flask import Blueprint

reports_bp = Blueprint('reports', __name__)

# Report generation routes will be implemented here
# - PDF export
# - Excel export  
# - DMAIC project summary reports

@reports_bp.route('/test', methods=['GET'])
def test():
    return {'message': 'Reports routes coming soon'}