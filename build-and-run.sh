#!/bin/bash

# Step 1: Build the Frontend
echo "Building frontend..."
npm --prefix frontend run build

# Step 2: Copy Static Assets to Spring Boot
echo "Preparing Spring Boot static resources..."
STATIC_DIR="backend/src/main/resources/static"
DIST_DIR="frontend/dist"

# Ensure static directory exists
mkdir -p "$STATIC_DIR"
cp -R "$DIST_DIR"/* "$STATIC_DIR"

# Step 3: Package the Spring Boot Application
echo "Packaging Spring Boot application..."
./mvnw -f backend/pom.xml clean package

# Step 4: Run the Production Application
echo "Running application..."
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar
