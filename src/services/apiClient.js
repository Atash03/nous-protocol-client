const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class NousAPIClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.api.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.api.key}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (request) => {
        logger.info('Making API request', {
          url: request.url,
          method: request.method,
          timestamp: new Date().toISOString()
        });
        return request;
      },
      (error) => {
        logger.error('Request interceptor error', { error: error.message });
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info('API response received', {
          status: response.status,
          statusText: response.statusText,
          responseTime: response.headers['x-response-time'] || 'unknown'
        });
        return response;
      },
      (error) => {
        logger.error('API response error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  async makeTestRequest() {
    try {
      const response = await this.client.post('/v1/chat/completions', {
        model: config.api.model,
        messages: [
          {
            role: 'user',
            content: 'Hello! This is a test request. Please respond briefly.'
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });

      logger.info('Successful API request', {
        model: config.api.model,
        tokensUsed: response.data.usage?.total_tokens || 'unknown',
        responseLength: response.data.choices?.[0]?.message?.content?.length || 0
      });

      return response.data;
    } catch (error) {
      logger.error('API request failed', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      throw error;
    }
  }

  async makeCustomRequest(prompt, options = {}) {
    try {
      const requestBody = {
        model: config.api.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 150,
        temperature: options.temperature || 0.7,
        ...options
      };

      const response = await this.client.post('/v1/chat/completions', requestBody);

      logger.info('PROMPT & Custom API request completed', {
        prompt: prompt,
        tokensUsed: response.data.usage?.total_tokens || 'unknown'
      });

      return response.data;
    } catch (error) {
      logger.error('Custom API request failed', {
        error: error.message,
        prompt: prompt.substring(0, 50) + '...'
      });
      throw error;
    }
  }
}

module.exports = NousAPIClient;
