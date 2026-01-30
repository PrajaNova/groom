#!/bin/bash

# Database Deployment Script for CI/CD
# Uses migrations to safely deploy schema changes without data loss
# Usage: ./scripts/db-deploy.sh

set -e  # Exit on error

echo "🚀 Deploying database migrations..."

# Function to deploy migrations for a single service
deploy_migrations() {
  local service_path=$1
  local service_name=$(basename "$service_path")
  
  echo ""
  echo "📦 Deploying $service_name..."
  cd "$service_path"
  
  # Check if migrations directory exists
  if [ ! -d "prisma/migrations" ]; then
    echo "⚠️  $service_name: No migrations directory found"
    echo "💡 Run 'pnpm db:migrate' locally first to create migrations"
    return 1
  fi
  
  # Deploy migrations (production-safe, no data loss)
  echo "📤 Applying migrations..."
  pnpm exec prisma migrate deploy
  
  echo "✅ $service_name: Migrations deployed successfully"
  return 0
}

# Get the root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Track if any service failed
FAILED=false

# Deploy to each microservice
for service in "$ROOT_DIR"/server/*-ms; do
  if [ -d "$service" ]; then
    if ! deploy_migrations "$service"; then
      FAILED=true
    fi
    cd "$ROOT_DIR"
  fi
done

echo ""
if [ "$FAILED" = true ]; then
  echo "❌ Some services failed to deploy migrations"
  echo "💡 Make sure you've created migrations locally with 'pnpm db:migrate'"
  exit 1
else
  echo "✅ All migrations deployed successfully!"
  exit 0
fi

