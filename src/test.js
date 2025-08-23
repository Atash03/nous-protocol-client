const NousAPIClient = require('./services/apiClient');
const logger = require('./utils/logger');

async function testAPI() {
  const client = new NousAPIClient();
  
  try {
    logger.info('Testing API connection...');
    const response = await client.makeTestRequest();
    logger.info('API test successful!', {
      response: response.choices?.[0]?.message?.content
    });
  } catch (error) {
    logger.error('API test failed', { error: error.message });
  }
}

testAPI();
