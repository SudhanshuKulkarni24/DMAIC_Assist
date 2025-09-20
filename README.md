# 🎯 DMAIC Assistant MVP

A digital platform to help consultants and managers run the DMAIC (Define–Measure–Analyze–Improve–Control) cycle efficiently.

## 🚀 Features

- **Upload & Analyze Data**: CSV upload with Lean Six Sigma-friendly visualizations
- **DMAIC Stage Tracking**: Complete workflow from Define to Control
- **Statistical Analysis**: Built-in tools for hypothesis testing, ANOVA, regression
- **Root Cause Analysis**: Interactive Fishbone diagrams and 5 Whys templates
- **Professional Reports**: Export results as PDF/Excel for consulting deliverables

## 🏗️ Architecture

```
dmaic/
├── backend/          # Flask API + PostgreSQL
├── frontend/         # React + TypeScript
├── docs/            # Documentation
├── docker-compose.yml
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Flask** - Web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Pandas** - Data processing
- **SciPy/Statsmodels** - Statistical analysis
- **Matplotlib/Seaborn** - Chart generation
- **ReportLab** - PDF reports

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **React Query** - State management
- **Recharts** - Data visualization
- **React Flow** - Interactive diagrams
- **Shadcn/UI** - Component library

### Infrastructure
- **Docker** - Containerization
- **AWS ECS** - Container orchestration
- **AWS RDS** - Managed PostgreSQL
- **AWS S3** - File storage

## 🚀 Quick Start

### Development Setup

1. **Clone and Setup**
```bash
git clone <repository>
cd dmaic
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 📊 DMAIC Workflow

### 1. Define Stage
- Project charter creation
- SIPOC diagram builder
- Stakeholder identification

### 2. Measure Stage
- Automated descriptive statistics
- Pareto charts and histograms
- Control charts (X̄-R, p-chart)

### 3. Analyze Stage
- Hypothesis testing (t-test, chi-square)
- ANOVA analysis
- Linear regression
- Root cause analysis tools

### 4. Improve Stage
- Improvement ideas tracker
- Impact/effort matrix
- Before/after comparisons

### 5. Control Stage
- Monitoring dashboards
- Action item tracking
- Ongoing performance monitoring

## 🔧 Development

### Adding New Features

1. **Backend API**: Add endpoints in `backend/app/routes/`
2. **Frontend Components**: Create components in `frontend/src/components/`
3. **Database Models**: Update models in `backend/app/models/`
4. **Tests**: Add tests in respective `tests/` directories

### Code Style

- **Backend**: Follow PEP 8 with Black formatter
- **Frontend**: ESLint + Prettier configuration
- **Git**: Conventional commits

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Frontend Components](docs/frontend.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for Six Sigma practitioners, consultants, and process improvement professionals.**