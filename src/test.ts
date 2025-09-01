import NousAPIClient from "./services/apiClient.js";

async function testAPI(): Promise<void> {
  const client = new NousAPIClient();

  try {
    console.info("Testing API connection...");
    const response = await client.makeTestRequest();
    console.info("API test successful!", {
      response: response.choices?.[0]?.message?.content,
    });
  } catch (error: any) {
    console.error("API test failed", { error: error.message });
  }
}

testAPI();
