# Nous Research API Random Request Client (TypeScript + PM2)

A TypeScript application that makes automated requests to the Nous Research API at random intervals, using Hugging Face models for prompt generation. Designed for production deployment with PM2 process manager.

## Features
- **TypeScript Support**: Full type safety and modern ES modules
- **Free LLM Integration**: Uses Hugging Face Inference API (no API costs)
- **Production Ready**: PM2 process management with auto-restart
- **Automated Scheduling**: Makes requests at random intervals
- **Comprehensive Logging**: Winston-based logging with multiple transports
- **Graceful Shutdown**: Proper signal handling for clean exits

## Quick Start (Development)
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your API credentials
4. Run `npm test` to verify API connection
5. Run `npm start` to begin scheduled requests

## Production Deployment with PM2

### Installation
```bash
# Install PM2 globally
npm install -g pm2

# Or install locally in your project
npm install pm2 --save-dev
```

### Basic PM2 Usage

#### Start the Application
```bash
# Using the ecosystem configuration
pm2 start ecosystem.config.js
```

### Environment Variables
- **NOUS_API_KEY**: Your Nous Research API key
- **GEMINI_API_KEY**: Your Gemini API key
- **REQUEST_INTERVAL_MIN/MAX**: Timing intervals for requests
- **LOG_LEVEL**: Logging verbosity (info, debug, error)

### PM2-Specific Settings
- **Memory Limit**: 1GB (configurable in ecosystem.config.js)
- **Auto-restart**: Enabled on crashes
- **Log Files**: Located in `./logs/` directory
- **Restart Policy**: Up to 10 restarts with 4-second delays

## Available Scripts
- `npm start` - Development mode with tsx
- `npm run dev` - Development with auto-restart (nodemon)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run test` - Run API tests
- `npm run lint` - Lint TypeScript files
- `pm2 start ecosystem.config.js` - Production mode with PM2
