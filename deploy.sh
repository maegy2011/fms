#!/bin/bash

# Production Deployment Script for FMS

echo "🚀 Starting Financial Management System Deployment..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated successfully"

# Push database schema
echo "🗄️ Pushing database schema..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Failed to push database schema"
    exit 1
fi

echo "✅ Database schema pushed successfully"

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Application built successfully"

# Create admin user (if it doesn't exist)
echo "👤 Creating admin user..."
npx tsx scripts/create-admin.ts

echo "✅ Admin user creation completed"

echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Application is ready to start with:"
echo "   npm start"
echo ""
echo "🔐 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "⚠️  Remember to:"
echo "   1. Update your .env file with production values"
echo "   2. Change the default admin password"
echo "   3. Set up proper database for production"
echo "   4. Configure your domain and SSL"