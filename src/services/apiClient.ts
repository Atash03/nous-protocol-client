import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config/index.js";

export interface APIRequestOptions {
  maxTokens?: number;
  temperature?: number;
  [key: string]: any;
}

export interface APIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class NousAPIClient {
  private client: AxiosInstance;

  constructor() {
    if (!config.api.baseUrl) {
      throw new Error("NOUS_API_BASE_URL is required");
    }

    this.client = axios.create({
      baseURL: config.api.baseUrl,
      headers: {
        Authorization: `Bearer ${config.api.key}`,
        "Content-Type": "application/json",
      },
      timeout: 30000, // 30 second timeout
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
        console.info("Making API request", {
          url: request.url,
          method: request.method,
          timestamp: new Date().toISOString(),
        });
        return request;
      },
      (error) => {
        console.error("Request interceptor error", { error: error.message });
        return Promise.reject(error);
      },
    );

    // Response interceptor for logging
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.info("API response received", {
          status: response.status,
          statusText: response.statusText,
          responseTime: response.headers["x-response-time"] || "unknown",
        });
        return response;
      },
      (error) => {
        console.error("API response error", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
        });
        return Promise.reject(error);
      },
    );
  }

  async makeTestRequest(): Promise<APIResponse> {
    try {
      const response = await this.client.post<APIResponse>("/v1/chat/completions", {
        model: config.api.model,
        messages: [
          {
            role: "user",
            content: "Hello! This is a test request. Please respond briefly.",
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      console.info("Successful API request", {
        model: config.api.model,
        tokensUsed: response.data.usage?.total_tokens || "unknown",
        responseLength:
          response.data.choices?.[0]?.message?.content?.length || 0,
      });

      return response.data;
    } catch (error: any) {
      console.error("API request failed", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
      throw error;
    }
  }

  async makeCustomRequest(prompt: string, options: APIRequestOptions = {}): Promise<APIResponse> {
    try {
      const requestBody = {
        model: config.api.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: options.maxTokens || 150,
        temperature: options.temperature || 0.7,
        ...options,
      };

      const response = await this.client.post<APIResponse>(
        "/v1/chat/completions",
        requestBody,
      );

      console.info("PROMPT & Custom API request completed", {
        prompt: prompt,
        tokensUsed: response.data.usage?.total_tokens || "unknown",
      });

      return response.data;
    } catch (error: any) {
      console.error("Custom API request failed", {
        error: error.message,
        prompt: prompt.substring(0, 50) + "...",
      });
      throw error;
    }
  }
}

export default NousAPIClient;
