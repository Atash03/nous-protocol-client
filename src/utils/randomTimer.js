const crypto = require('crypto');
const logger = require('./logger');
const config = require('../config');

class RandomTimer {
  constructor(minMinutes, maxMinutes) {
    this.minMinutes = minMinutes;
    this.maxMinutes = maxMinutes;
  }

  getRandomInterval() {
    // Generate cryptographically secure random number
    const randomBytes = crypto.randomBytes(4);
    const randomValue = randomBytes.readUInt32BE(0) / 0xFFFFFFFF;

    const intervalMinutes = this.minMinutes +
      (randomValue * (this.maxMinutes - this.minMinutes));

    const intervalMs = Math.floor(intervalMinutes * 60 * 1000);

    logger.info(`Next request scheduled in ${intervalMinutes.toFixed(2)} minutes`);
    return intervalMs;
  }

  schedule(callback) {
    const interval = this.getRandomInterval();

    setTimeout(() => {
      callback();
      this.schedule(callback);
    }, interval);
  }
}

module.exports = RandomTimer;
