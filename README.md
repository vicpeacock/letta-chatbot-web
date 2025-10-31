# Letta Chatbot with Ollama and MCP Integration

This project provides a complete Docker-based setup for running a Letta chatbot with local Ollama models and MCP (Model Context Protocol) server integration.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop with MCP Toolkit enabled
- Ollama running on your host machine
- Docker Compose

### Start Everything
```bash
# Start in production mode
./start-docker.sh

# Or start in development mode (with hot reloading)
./start-docker.sh dev
```

## 🐳 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Letta ADE     │    │   Docker MCP     │    │   MCP Servers   │
│   (Container)   │◄──►│   Gateway        │◄──►│   (Containers)  │
│   Port: 8283    │    │   Port: 8080     │    │   - Wikipedia   │
└─────────────────┘    └──────────────────┘    │   - Google Maps │
         ▲                                      │   - Playwright  │
         │                                      │   - Paper Search│
         ▼                                      └─────────────────┘
┌─────────────────┐    
│   Chatbot UI    │    
│   (Container)   │    
│   Port: 3002    │    
└─────────────────┘    
         ▲              
         │              
         ▼              
┌─────────────────┐    
│   Ollama        │    
│   (Host)        │    
│   Port: 11434   │    
└─────────────────┘    
```

## 📋 Services

### 1. Letta Server (Containerized)
- **Image**: `letta/letta:latest`
- **Port**: `8283:8283`
- **Features**: 
  - Connects to host Ollama via `host.docker.internal:11434`
  - Supports Docker Model Runner endpoint
  - Exa API integration for web search

### 2. Chatbot UI (Containerized)
- **Build**: Next.js application
- **Port**: `3001:3000`
- **Features**: 
  - Modern React-based chat interface
  - Agent creation and management
  - User session management

### 3. Docker MCP Gateway (Host)
- **Command**: `docker mcp gateway run --port 8080 --transport streaming`
- **Port**: `8080`
- **Features**: 
  - Provides 63 MCP tools
  - Streaming transport for real-time communication
  - Access to Google Maps, Wikipedia, Playwright, and Paper Search

### 4. Ollama (Host)
- **Port**: `11434`
- **Models**: 
  - LLM: `gpt-oss:20b`
  - Embedding: `nomic-embed-text`

## 🔧 Configuration

### Environment Variables

> **📖 See [SETUP.md](./SETUP.md) for detailed setup instructions**

#### Environment Setup

1. **Copy the environment template files:**
   ```bash
   cp .env.template .env
   cp .env.docker.template .env.docker
   ```

2. **Edit `.env.docker` with your actual API keys:**
   ```bash
   # Letta Server Configuration
   LETTA_API_KEY=your-letta-api-key-here
   OLLAMA_BASE_URL=http://host.docker.internal:11434
   MODEL_RUNNER_ENDPOINT=http://model-runner.docker.internal/engines/v1
   EXA_API_KEY=your-exa-api-key-here  # Optional for web search
   
   # Chatbot UI Configuration
   LETTA_BASE_URL=http://letta-server:8283
   USE_COOKIE_BASED_AUTHENTICATION=true
   NEXT_PUBLIC_CREATE_AGENTS_FROM_UI=true
   
   # MCP Gateway Configuration (Optional)
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
   GOOGLE_MAPS_CX=your-google-maps-cx-here
   ```

> **Note:** Never commit `.env` or `.env.docker` files to version control. They are already in `.gitignore`.

### Agent Configuration

#### Default Agent Settings (`letta-chatbot-web/default-agent.json`)
```json
{
  "DEFAULT_MEMORY_BLOCKS": [
    {
      "label": "human",
      "value": "The human's name is [Your Name]"
    },
    {
      "label": "persona",
      "value": "You are a helpful AI assistant with access to web search and memory tools. You can help with research, answer questions, and remember information across conversations."
    }
  ],
  "DEFAULT_LLM": "ollama/gpt-oss:20b",
  "DEFAULT_EMBEDDING": "ollama/nomic-embed-text"
}
```

## 🌐 Access Points

Once all services are running, you can access:

- **Letta ADE**: http://localhost:8283
- **Chatbot UI**: http://localhost:3001
- **MCP Gateway**: http://localhost:8080/mcp
- **Ollama**: http://localhost:11434

## 🔌 MCP Integration

### Available MCP Tools (63 total)
- **Google Maps**: 8 tools for location services
- **Playwright**: 21 tools for web automation
- **Wikipedia**: 11 tools + 9 resource templates
- **Paper Search**: 23 tools for academic research

### Connecting MCP Gateway to Letta ADE

1. Open Letta ADE at http://localhost:8283
2. Go to MCP Servers configuration
3. Add new server with:
   - **Server Type**: `Streamable HTTP`
   - **Server Name**: `docker_mcp_gateway`
   - **Server URL**: `http://host.docker.internal:8080/mcp`

## 🛠️ Development

### Development Mode
```bash
./start-docker.sh dev
```
This starts the chatbot in development mode with hot reloading.

### Viewing Logs
```bash
# Production mode
docker-compose logs -f

# Development mode
docker-compose -f docker-compose.dev.yml logs -f
```

### Stopping Services
```bash
# Production mode
docker-compose down --volumes --remove-orphans

# Development mode
docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
```

## 📁 Project Structure

```
├── docker-compose.yml              # Production Docker Compose
├── docker-compose.dev.yml          # Development Docker Compose
├── start-docker.sh                 # Startup script
├── config.yaml                     # MCP Gateway configuration
├── registry.yaml                   # MCP server registry
├── tools.yaml                      # MCP tools configuration
├── letta-chatbot-web/              # Next.js chatbot application
│   ├── Dockerfile                  # Production Dockerfile
│   ├── Dockerfile.dev              # Development Dockerfile
│   ├── default-agent.json          # Default agent configuration
│   ├── .env.local                  # Environment variables
│   └── src/                        # Source code
└── README.md                       # This file
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3002, 8080, 8283, and 11434 are available
   - Use `lsof -i :<port>` to check port usage

2. **Ollama Connectivity**
   - Verify Ollama is running on host: `curl http://localhost:11434/api/tags`
   - Check models are loaded: `ollama list`

3. **MCP Gateway Connection**
   - Ensure MCP Gateway is running: `docker mcp gateway run --port 8080 --transport streaming`
   - Test connection: `curl http://localhost:8080/mcp`

4. **Docker Networking**
   - Use `host.docker.internal` for container-to-host communication
   - Verify Docker Desktop networking is enabled

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down --volumes --remove-orphans
docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans

# Remove any orphaned containers
docker container prune -f
docker network prune -f
docker volume prune -f
```

## 🔄 Updates

### Updating Letta
```bash
docker-compose pull letta-server
docker-compose up -d letta-server
```

### Updating Chatbot
```bash
# Development
docker-compose -f docker-compose.dev.yml build chatbot
docker-compose -f docker-compose.dev.yml up -d chatbot

# Production
docker-compose build chatbot
docker-compose up -d chatbot
```

## 📚 Additional Resources

- [Letta Documentation](https://docs.letta.com/)
- [Docker MCP Toolkit](https://github.com/docker/mcp-gateway)
- [Ollama Documentation](https://ollama.ai/docs)
- [MCP Specification](https://spec.modelcontextprotocol.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both development and production modes
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
