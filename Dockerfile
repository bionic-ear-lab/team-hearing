# Multi-stage build for backend (includes frontend)

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-21 AS backend-builder

WORKDIR /app

# Copy root pom.xml and mvnw
COPY pom.xml mvnw* ./
COPY .mvn .mvn

# Copy backend pom.xml
COPY backend/pom.xml ./backend/

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -f backend/pom.xml

# Copy backend source code
COPY backend/src ./backend/src

# Copy built frontend to backend static resources
COPY --from=frontend-builder /app/frontend/dist ./backend/src/main/resources/static

# Build backend JAR
RUN mvn clean package -f backend/pom.xml -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=backend-builder /app/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

