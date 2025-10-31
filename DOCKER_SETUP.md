# Letta Chatbot Docker Setup

This setup containerizes the Letta chatbot application along with all its dependencies.

## 🏗️ Architecture

The Docker setup includes:
- **Letta Server**: Core AI agent server
- **Ollama**: Local LLM server
- **Chatbot**: Next.js web interface
- **MCP Gateway**: Model Context Protocol gateway

## 🚀 Quick Start

### Development Mode (with hot reloading)
```bash
./start-docker.sh dev
```

### Production Mode
```bash
./start-docker.sh
```

### Manual Docker Compose
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose up --build
```

## 📱 Access Points

Once running, you can access:
- **Chatbot**: http://localhost:3000
- **Letta ADE**: http://localhost:8283
- **Ollama**: http://localhost:11434
- **MCP Gateway**: http://localhost:8080

## 🔧 Configuration

### Environment Variables

The setup uses the following environment variables:

#### Letta Server
- `LETTA_API_KEY`: API key for Letta (default: DEFAULT_TOKEN)
- `OLLAMA_BASE_URL`: Ollama server URL
- `MODEL_RUNNER_ENDPOINT`: Docker Model Runner endpoint
- `EXA_API_KEY`: Exa API key for web search

#### Chatbot
- `LETTA_BASE_URL`: Letta server URL
- `USE_COOKIE_BASED_AUTHENTICATION`: Enable cookie auth
- `NEXT_PUBLIC_CREATE_AGENTS_FROM_UI`: Enable agent creation from UI

## 🛠️ Development

### Hot Reloading
The development setup includes volume mounting for hot reloading:
- Source code changes are automatically reflected
- Node modules are cached in a separate volume

### Adding New Dependencies
```bash
# Add to package.json, then rebuild
docker-compose -f docker-compose.dev.yml up --build
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 8283, 11434, and 8080 are available
2. **Permission issues**: Ensure Docker has proper permissions
3. **Memory issues**: Ollama models require sufficient RAM

### Logs
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f chatbot
docker-compose logs -f letta-server
```

### Cleanup
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## 📦 Services

### Letta Server
- **Image**: `letta/letta:latest`
- **Port**: 8283
- **Data**: Persistent volume for agent data

### Ollama
- **Image**: `ollama/ollama:latest`
- **Port**: 11434
- **Data**: Persistent volume for models

### Chatbot
- **Build**: Custom Next.js application
- **Port**: 3000
- **Mode**: Development (hot reload) or Production

### MCP Gateway
- **Image**: `mcp/gateway:latest`
- **Port**: 8080
- **Servers**: arxiv, google-maps, paper-search, playwright, wikipedia

## 🔄 Updates

To update the setup:
1. Pull latest images: `docker-compose pull`
2. Rebuild containers: `docker-compose up --build`
3. Restart services: `docker-compose restart`

## 📝 Notes

- All services run in the same Docker network for internal communication
- Data is persisted using Docker volumes
- The setup is designed for local development and testing
- For production deployment, consider using a reverse proxy and SSL
