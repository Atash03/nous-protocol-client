import crypto from "crypto";
import logger from "./logger.js";

export interface RandomTimerOptions {
  minMinutes: number;
  maxMinutes: number;
}

export class RandomTimer {
  private minMinutes: number;
  private maxMinutes: number;

  constructor(minMinutes: number, maxMinutes: number) {
    this.minMinutes = minMinutes;
    this.maxMinutes = maxMinutes;
  }

  private getRandomInterval(): number {
    // Generate cryptographically secure random number
    const randomBytes = crypto.randomBytes(4);
    const randomValue = randomBytes.readUInt32BE(0) / 0xffffffff;

    const intervalMinutes =
      this.minMinutes + randomValue * (this.maxMinutes - this.minMinutes);

    const intervalMs = Math.floor(intervalMinutes * 60 * 1000);

    logger.info(
      `Next request scheduled in ${intervalMinutes.toFixed(2)} minutes`,
    );
    return intervalMs;
  }

  public schedule(callback: () => void): void {
    const interval = this.getRandomInterval();

    setTimeout(() => {
      callback();
      this.schedule(callback);
    }, interval);
  }
}