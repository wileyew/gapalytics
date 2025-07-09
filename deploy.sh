#!/bin/bash

# 🚀 AWS Amplify Deployment Script
# This script prepares your application for AWS Amplify deployment

echo "🚀 Preparing Gaplytics for AWS Amplify deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if amplify.yml exists
if [ ! -f "amplify.yml" ]; then
    echo "❌ Error: amplify.yml not found. Please create the Amplify configuration file."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found. Please create it with your production environment variables."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build to test
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the issues before deploying."
    exit 1
fi

# Check if dist directory was created
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build."
    exit 1
fi

echo "✅ Build artifacts created successfully!"

# Git status check
echo "📋 Checking Git status..."
if [ -d ".git" ]; then
    git status --porcelain
    echo ""
    echo "📝 Next steps:"
    echo "1. Commit your changes: git add . && git commit -m 'Prepare for AWS Amplify deployment'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Follow the AWS Amplify Console setup in DEPLOYMENT.md"
else
    echo "⚠️  Warning: Not a Git repository. Please initialize Git and push to GitHub."
fi

echo ""
echo "🎉 Preparation complete! Follow the steps in DEPLOYMENT.md to deploy on AWS Amplify." 