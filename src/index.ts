import config from "./config/index.js";
import logger from "./utils/logger.js";
import NousAPIClient from "./services/apiClient.js";
import axios from "axios";
import { RandomTimer } from "./utils/randomTimer.js";

class NousAPIScheduler {
  private apiClient: NousAPIClient;
  private randomTimer: RandomTimer;
  private requestCount: number;
  private startTime: Date;
  private requestLimit: number;

  constructor() {
    this.apiClient = new NousAPIClient();
    this.randomTimer = new RandomTimer(
      config.timing.minInterval,
      config.timing.maxInterval,
    );
    this.requestCount = 0;
    this.startTime = new Date();
    this.requestLimit =
      Math.floor(
        Math.random() *
          (config.requestLimits.max - config.requestLimits.min + 1),
      ) + config.requestLimits.min;
  }

  private async makeScheduledRequest(): Promise<void> {
    if (this.requestCount >= this.requestLimit) {
      logger.info("Request limit reached. Stopping scheduler.");
      this.stop();
      return;
    }

    try {
      this.requestCount++;

      logger.info(`Making scheduled request #${this.requestCount}`);

      // Get random prompt from Gemini API
      async function getRandomPrompt(): Promise<string> {
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
          {
            contents: [
              {
                parts: [
                  {
                    text: "Generate a random interesting prompt to give to the human-centric language models and simulators. Just give the prompt itself, don't give additional instructions, and don't give the previous prompt.",
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 50,
              temperature: 0.7,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": process.env.GEMINI_API_KEY,
            },
          },
        );
        return response.data.candidates[0].content.parts[0].text;
      }

      const randomPrompt = await getRandomPrompt();
      const response = await this.apiClient.makeCustomRequest(randomPrompt);

      logger.info(`Request #${this.requestCount} completed successfully`, {
        responsePreview: response.choices?.[0]?.message?.content,
      });
    } catch (error: any) {
      logger.error(`Request #${this.requestCount} failed`, {
        error: error.message,
      });
    }
  }

  public start(): void {
    logger.info("Starting Nous API Scheduler", {
      minInterval: config.timing.minInterval,
      maxInterval: config.timing.maxInterval,
      model: config.api.model,
    });

    // Make first request immediately
    this.makeScheduledRequest();

    // Schedule subsequent requests
    this.randomTimer.schedule(() => {
      this.makeScheduledRequest();
    });

    // Log statistics every hour
    setInterval(
      () => {
        const runtime = (new Date().getTime() - this.startTime.getTime()) / 1000 / 60; // minutes
        logger.info("Runtime statistics", {
          totalRequests: this.requestCount,
          runtimeMinutes: runtime.toFixed(2),
          avgRequestsPerHour: ((this.requestCount / runtime) * 60).toFixed(2),
          requestCount: this.requestCount,
          requestLimit: this.requestLimit,
        });
      },
      60 * 60 * 1000,
    ); // Every hour
  }

  public stop(): void {
    logger.info("Request limit reached. Resetting scheduler for the next day.");
    this.resetScheduler();
  }

  private resetScheduler(): void {
    // Clear any existing timers
    if (this.randomTimer) {
      clearTimeout(this.randomTimer as any);
    }

    // Reset counters
    this.requestCount = 0;
    this.startTime = new Date();
    this.requestLimit =
      Math.floor(
        Math.random() *
          (config.requestLimits.max - config.requestLimits.min + 1),
      ) + config.requestLimits.min;

    // Schedule the next run for a random time tomorrow
    const delay = getDelayUntilNextStartTime();
    logger.info(
      `Next run scheduled in ${Math.floor(delay / 1000 / 60)} minutes`,
    );

    setTimeout(() => {
      logger.info("Starting new scheduler for the day");
      this.start();
    }, delay);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// Function to get a random start time within the day
function getRandomStartTime(): Date {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  const randomTime = new Date(
    startOfDay.getTime() +
      Math.random() * (endOfDay.getTime() - startOfDay.getTime()),
  );
  return randomTime;
}

// Function to calculate the delay until the next random start time
function getDelayUntilNextStartTime(): number {
  const now = new Date();
  const randomStartTime = getRandomStartTime();
  if (randomStartTime < now) {
    randomStartTime.setDate(randomStartTime.getDate() + 1);
  }
  return randomStartTime.getTime() - now.getTime();
}

const scheduler = new NousAPIScheduler();
scheduler.start();
