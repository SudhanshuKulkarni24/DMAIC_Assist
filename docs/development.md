# Development Documentation

## Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd dmaic
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose (Recommended)**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

## Manual Development Setup

### Backend

1. **Create virtual environment**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up database**
```bash
flask db upgrade
```

4. **Run development server**
```bash
flask run
```

### Frontend

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start development server**
```bash
npm run dev
```

## Project Structure

```
dmaic/
├── backend/                 # Flask API
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── uploads/            # File uploads
│   └── tests/              # Backend tests
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utilities
│   └── public/             # Static assets
│
└── docs/                   # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `PUT /api/projects/{id}/stage` - Update project stage

### Data Management
- `POST /api/data/upload/{project_id}` - Upload CSV/Excel
- `GET /api/data/{project_id}` - List project data
- `GET /api/data/upload/{upload_id}` - Get upload details
- `GET /api/data/upload/{upload_id}/data` - Preview data
- `DELETE /api/data/upload/{upload_id}` - Delete upload

### Analysis (Coming Soon)
- Statistical analysis endpoints
- Chart generation endpoints
- Report generation endpoints

## Database Schema

### Core Models
- **User** - User accounts and authentication
- **Project** - DMAIC projects with stage tracking
- **DataUpload** - Uploaded datasets and metadata
- **Analysis** - Analysis results and configurations

## DMAIC Workflow

1. **Define** - Project charter, SIPOC diagram
2. **Measure** - Data collection, baseline metrics
3. **Analyze** - Statistical analysis, root cause analysis
4. **Improve** - Improvement ideas and implementation
5. **Control** - Monitoring and control plans

## Technology Stack

### Backend
- Flask - Web framework
- SQLAlchemy - ORM
- PostgreSQL - Database
- Pandas - Data processing
- SciPy/Statsmodels - Statistical analysis
- Matplotlib/Seaborn - Visualization

### Frontend
- React - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- React Query - State management
- Recharts - Data visualization
- React Flow - Interactive diagrams

### Infrastructure
- Docker - Containerization
- Docker Compose - Multi-container setup
- Nginx - Reverse proxy
- Redis - Caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.