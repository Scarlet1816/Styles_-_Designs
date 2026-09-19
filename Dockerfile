# Stage 1: Build the WAR using Ant
FROM eclipse-temurin:17-jdk AS builder

# Install Ant
RUN apt-get update && apt-get install -y ant && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
WORKDIR /app/WebsitQjava
RUN ant clean dist

# Copy your entire project
COPY . .

# Build the WAR file using the build.xml
RUN ant clean dist

# Stage 2: Deploy to Tomcat
FROM tomcat:9.0-jdk17

# Remove default ROOT app to avoid conflicts
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copy the built WAR to Tomcat's webapps as ROOT.war
# NetBeans Ant projects put the WAR in the dist/ folder
COPY --from=builder /app/dist/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
