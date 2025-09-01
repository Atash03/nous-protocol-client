import { NousAPIScheduler } from "./entities/nous-api-scheduler/index.js";

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

const scheduler = new NousAPIScheduler();
scheduler.start();
