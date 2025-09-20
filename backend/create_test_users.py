#!/usr/bin/env python3
"""
Script to create test users for the DMAIC Assistant application
"""
import sys
import os
sys.path.append('/app')

from app import create_app, db
from app.models import User
from werkzeug.security import generate_password_hash

def create_test_users():
    app = create_app()
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Check if admin user already exists
        existing_user = User.query.filter_by(email='admin@dmaic.com').first()
        if existing_user:
            print("Admin user already exists!")
            return
        
        # Create admin user
        admin_user = User(
            email='admin@dmaic.com',
            password_hash=generate_password_hash('admin123'),
            first_name='DMAIC',
            last_name='Administrator',
            company='DMAIC Corp',
            role='Admin'
        )
        
        # Create test consultant user
        consultant_user = User(
            email='consultant@dmaic.com',
            password_hash=generate_password_hash('consultant123'),
            first_name='Jane',
            last_name='Consultant',
            company='Six Sigma Solutions',
            role='Consultant'
        )
        
        # Create test manager user
        manager_user = User(
            email='manager@dmaic.com',
            password_hash=generate_password_hash('manager123'),
            first_name='John',
            last_name='Manager',
            company='Manufacturing Corp',
            role='Manager'
        )
        
        try:
            db.session.add(admin_user)
            db.session.add(consultant_user)
            db.session.add(manager_user)
            db.session.commit()
            
            print("✅ Test users created successfully!")
            print("\n📋 Available test accounts:")
            print("1. Admin Account:")
            print("   Email: admin@dmaic.com")
            print("   Password: admin123")
            print("\n2. Consultant Account:")
            print("   Email: consultant@dmaic.com") 
            print("   Password: consultant123")
            print("\n3. Manager Account:")
            print("   Email: manager@dmaic.com")
            print("   Password: manager123")
            
        except Exception as e:
            print(f"❌ Error creating users: {e}")
            db.session.rollback()

if __name__ == '__main__':
    create_test_users()