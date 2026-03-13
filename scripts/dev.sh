#!/usr/bin/env bash
set -e

echo "Starting SkySense development environment..."
echo ""

if [ ! -d "dashboard/node_modules" ]; then
  echo "Installing dashboard dependencies..."
  cd dashboard && npm install && cd ..
fi

echo "Starting Next.js dashboard on http://localhost:3000"
cd dashboard && npm run dev
