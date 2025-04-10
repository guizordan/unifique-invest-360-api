#!/bin/bash

# Install pm2 if not already installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Install sequelize if not already installed
if ! command -v sequelize &> /dev/null; then
    npm install -g sequelize-cli
fi

# Receive environment parameter. Defaults to "test"
environment="${1:-test}"

# Set variables for server_name and domain_name
server_name="unifique-${environment}"

if [ "${environment}" = "prod" ]; then
    domain_name="unifique.com.br"
else
    domain_name="${environment}.unifique.com.br"
fi

# Check for unstaged changes in the web repository
cd /home/${server_name}/web
if ! git diff --quiet; then
    echo "Error: There are unstaged changes in the web repo. Please commit or stash them before proceeding."
    exit 1
fi

# Check for unstaged changes in the api repository
cd /home/${server_name}/api
if ! git diff --quiet; then
    echo "Error: There are unstaged changes in the api repo. Please commit or stash them before proceeding."
    exit 1
fi

# Stop PM2 process
pm2 delete ${server_name}

# Update the repository
git checkout main
git pull --force --rebase origin main

# If environment is "test", checkout and pull the "test" branch
if [ "${environment}" = "test" ]; then
    git checkout test
    git pull --force --rebase origin test
fi

# Install dependencies
npm install

# Run sequelize migrate command
npx sequelize db:migrate

# Start server using pm2
pm2 start --name "${server_name}" server.js --wait-ready

# Change directory to the web project
cd /home/${server_name}/web

# Update the repository
git checkout main
git pull --force --rebase origin main

# If environment is "test", checkout and pull the "test" branch
if [ "${environment}" = "test" ]; then
    git checkout test
    git pull --force --rebase origin test
fi

# Install dependencies
npm install

# Build the project
npm run build

# Copy the built files to the server's htdocs directory
cp -r ./dist/* "/home/${server_name}/htdocs/${domain_name}/"