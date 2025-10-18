#!/bin/bash

# Build script for Ponte Finance Marketplace
echo "🚀 Building Ponte Finance Marketplace..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Copy .htaccess to dist folder
echo "📋 Copying .htaccess to dist folder..."
cp .htaccess dist/

# Create deployment info
echo "📝 Creating deployment info..."
echo "Build completed on: $(date)" > dist/build-info.txt
echo "Git commit: $(git rev-parse HEAD 2>/dev/null || echo 'No git repo')" >> dist/build-info.txt

echo "✅ Build completed successfully!"
echo "📁 Files are ready in the 'dist' folder"
echo "🌐 Upload the contents of 'dist' to your web server"
echo ""
echo "📋 Deployment checklist:"
echo "   ✓ Upload all files from 'dist' folder"
echo "   ✓ Ensure .htaccess is uploaded"
echo "   ✓ Verify base URL is /marketplace_/"
echo "   ✓ Test all routes work correctly"
