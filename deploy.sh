#!/bin/bash

# UI Microfrontend - Deploy Script
# Скрипт для деплоя на AWS CloudFront

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}ℹ${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI not installed. Please install it first:"
    echo "  brew install awscli"
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    print_error ".env.production file not found!"
    echo "Please create it from .env.example and fill in the values."
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Check required variables
required_vars=("S3_BUCKET_NAME" "CLOUDFRONT_DISTRIBUTION_ID")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set in .env.production"
        exit 1
    fi
done

# Override with passed arguments
S3_BUCKET_NAME=${1:-$S3_BUCKET_NAME}
CLOUDFRONT_DISTRIBUTION_ID=${2:-$CLOUDFRONT_DISTRIBUTION_ID}

print_info "Starting deployment process..."
echo ""
echo "S3 Bucket: $S3_BUCKET_NAME"
echo "CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"
echo ""

# Check AWS credentials
print_info "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured or invalid"
    echo "Run: aws configure"
    exit 1
fi
print_success "AWS credentials OK"

# Build the project
print_info "Building the project..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "dist directory not found after build"
    exit 1
fi

# Upload to S3
print_info "Uploading files to S3..."

# Upload all files with long cache (except index.html and remoteEntry.js)
print_info "Uploading assets with long-term cache..."
aws s3 sync dist/ s3://${S3_BUCKET_NAME} \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "index.html" \
    --exclude "assets/remoteEntry.js" \
    --exclude "*.map"

if [ $? -eq 0 ]; then
    print_success "Assets uploaded"
else
    print_error "Failed to upload assets"
    exit 1
fi

# Upload index.html with no cache
print_info "Uploading index.html (no cache)..."
aws s3 cp dist/index.html s3://${S3_BUCKET_NAME}/index.html \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

if [ $? -eq 0 ]; then
    print_success "index.html uploaded"
else
    print_error "Failed to upload index.html"
    exit 1
fi

# Upload remoteEntry.js with short cache
if [ -f "dist/assets/remoteEntry.js" ]; then
    print_info "Uploading remoteEntry.js (short cache)..."
    aws s3 cp dist/assets/remoteEntry.js s3://${S3_BUCKET_NAME}/assets/remoteEntry.js \
        --cache-control "public, max-age=300" \
        --content-type "application/javascript"
    
    if [ $? -eq 0 ]; then
        print_success "remoteEntry.js uploaded"
    else
        print_warning "Failed to upload remoteEntry.js"
    fi
else
    print_warning "remoteEntry.js not found in dist/assets/"
fi

# Invalidate CloudFront cache
print_info "Creating CloudFront invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

if [ $? -eq 0 ]; then
    print_success "CloudFront invalidation created: $INVALIDATION_ID"
    print_info "Waiting for invalidation to complete (this may take a few minutes)..."
    
    aws cloudfront wait invalidation-completed \
        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
        --id ${INVALIDATION_ID}
    
    if [ $? -eq 0 ]; then
        print_success "Invalidation completed"
    else
        print_warning "Timeout waiting for invalidation. It will complete in the background."
    fi
else
    print_error "Failed to create CloudFront invalidation"
    exit 1
fi

# Get CloudFront URL
CLOUDFRONT_URL="https://$(aws cloudfront get-distribution --id ${CLOUDFRONT_DISTRIBUTION_ID} --query 'Distribution.DomainName' --output text)"

echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "CloudFront URL: $CLOUDFRONT_URL"
echo "Remote Entry: $CLOUDFRONT_URL/assets/remoteEntry.js"
echo ""
print_info "Your microfrontend is now live!"
