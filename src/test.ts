import NousAPIClient from "./services/apiClient.js";
import logger from "./utils/logger.js";

async function testAPI(): Promise<void> {
  const client = new NousAPIClient();

  try {
    logger.info("Testing API connection...");
    const response = await client.makeTestRequest();
    logger.info("API test successful!", {
      response: response.choices?.[0]?.message?.content,
    });
  } catch (error: any) {
    logger.error("API test failed", { error: error.message });
  }
}

testAPI();
