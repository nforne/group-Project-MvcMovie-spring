# Stage 1: build with Maven (use dependency caching)
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /src

# Copy pom first to leverage Docker layer cache for dependencies
COPY pom.xml .
# Download dependencies only (faster rebuilds when sources change)
RUN mvn -B dependency:go-offline

# Copy sources and build
COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: runtime (smaller, non-root user)
FROM eclipse-temurin:17-jdk-jammy
# Create non-root user for better security
RUN useradd --create-home --shell /bin/bash appuser
WORKDIR /app
COPY --from=builder /src/target/*.jar app.jar
RUN chown appuser:appuser /app/app.jar
USER appuser

EXPOSE 8080
# Use exec form so signals are forwarded correctly
ENTRYPOINT ["java","-jar","/app/app.jar"]
