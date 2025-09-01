import { NousAPIScheduler } from "./entities/nous-api-scheduler/index.js";
import logger from "./utils/logger.js";

// Handle graceful shutdown
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

const scheduler = new NousAPIScheduler();
scheduler.start();
