# Comment Service

The `comment_service` is a Node.js microservice responsible for managing comments in a social media application. This service registers with Eureka for service discovery, connects to a MongoDB database, and uses Kafka for messaging.

To view all services for this social media system, lets visit: `https://github.com/goddie9x?tab=repositories&q=social`

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

## Setup

### 1. Clone the Repository

Clone the `comment_service` repository and its required utilities:

```bash
git clone https://github.com/goddie9x/social_comment_service.git
cd comment_service
```

### 2. Clone Utility Package

Clone the required `social_utils` package as a subdirectory in the project root:

```bash
git clone https://github.com/goddie9x/social_utils.git utils
```

### 3. Configuration

Set up environment variables in a `.env` file in the root directory with the following configuration:

```dotenv
APP_NAME=comment-service
PORT=3006
MONGODB_URI=<mongo_connect_string>
IP_ADDRESS=comment-service
HOST_NAME=comment-service
APP_PATH=/api/v1/comments
EUREKA_DISCOVERY_SERVER_HOST=discovery-server
EUREKA_DISCOVERY_SERVER_PORT=8761
```

These variables are required for MongoDB connection, Eureka registration, and service configuration.

## Package Installation

Ensure dependencies are installed by running:

```bash
npm install
```

## Running the Service Locally

To start the service locally:

```bash
npm start
```

The service will run on `http://localhost:3006` by default.

## Running with Docker

1. **Dockerfile**:

   Create a `Dockerfile` in the project root with the following content:

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /usr/src/app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3006
   CMD ["npm", "start"]
   ```

2. **Build and Run the Docker Container**:

   Build and start the Docker container:

   ```bash
   docker build -t comment-service .
   docker run -p 3006:3006 --env-file .env comment-service
   ```

## Running with Docker Compose

To run `comment_service` within a Docker Compose setup, include the following service definition:

```yaml
comment-service:
  image: comment-service
  build:
    context: .
  ports:
    - 3006:3006
  environment:
    - APP_NAME=comment-service
    - PORT=3006
    - MONGODB_URI=mongodb://goddie9x:thisIsJustTheTestPassword123@mongo:27017/comment
    - IP_ADDRESS=comment-service
    - HOST_NAME=comment-service
    - APP_PATH=/api/v1/comments
    - EUREKA_DISCOVERY_SERVER_HOST=discovery-server
    - EUREKA_DISCOVERY_SERVER_PORT=8761
  depends_on:
    - mongo
    - discovery-server
  networks:
    - social-media-network
```

Start all services with Docker Compose:

```bash
docker-compose up --build
```

## Accessing the Service

Once running, the `comment_service` will be available at `http://localhost:3006/api/v1/comments`.

---

This setup will allow you to start, configure, and deploy the `comment_service` in both local and containerized environments.

### Services Overview

The `docker-compose.yaml` file defines several key services:
- **Kafka**: Handles messaging between microservices.
- **MongoDB**: Database for storing application data.
- **Oracle, Postgres**: Databases for specific services.
- **Elasticsearch and Kibana**: For search and data visualization.
- **Discovery Server (Eureka)**: Service registry for load balancing.
- **API Gateway**: Routes client requests to backend microservices.
  
Each service is assigned a port and added to the `social-media-network` to facilitate inter-service communication.

### Useful Commands

- **Stop Containers**: Use `docker-compose down` to stop all services and remove the containers.
- **Restart Containers**: Run `docker-compose restart` to restart the services without rebuilding the images.

This setup enables seamless orchestration of the social media microservices with an API Gateway for managing external client requests.

## Contributing

Contributions are welcome. Please clone this repository and submit a pull request with your changes. Ensure that your changes are well-tested and documented.

## License

This project is licensed under the MIT License. See `LICENSE` for more details.