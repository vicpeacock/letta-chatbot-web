# Setup Instructions

## Environment Variables Setup

This project uses environment variables to store sensitive API keys. Follow these steps to configure your environment:

### 1. Create Environment Files

Copy the template files and fill in your actual values:

```bash
# For local development (Next.js)
cp .env.template .env

# For Docker Compose services
cp .env.docker.template .env.docker
```

### 2. Configure Your API Keys

Edit `.env.docker` with your actual API keys:

- `LETTA_API_KEY`: Your Letta API key
- `EXA_API_KEY`: Your Exa API key (optional, for web search)
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key (optional, for MCP Gateway)
- `GOOGLE_MAPS_CX`: Your Google Maps CX (optional, for MCP Gateway)

### 3. Verify .gitignore

Make sure your `.env` and `.env.docker` files are not tracked by git:

```bash
git status
```

These files should NOT appear in the git status output.

### 4. Never Commit API Keys

**Important:** Never commit files containing real API keys:
- `.env`
- `.env.docker`
- `.env.local`
- `.env.*.local`

These files are automatically excluded via `.gitignore`.

## Docker Compose

The Docker Compose files (`docker-compose.yml` and `docker-compose.dev.yml`) are configured to:
- Read environment variables from `.env.docker`
- Use default values if environment variables are not set (for development/testing only)

## Production Deployment

For production deployments, use proper secrets management:
- GitHub Secrets (for CI/CD)
- Docker Secrets
- AWS Secrets Manager / Parameter Store
- Kubernetes Secrets
- Other secure secret management systems

Never hardcode API keys in production code or configuration files.
