import config from "@/config";
import NousAPIClient from "@/services/apiClient";
import { getRandomPrompt } from "@/utils/getRandomPrompt";
import { getDelayUntilNextStartTime } from "@/utils/getRandomStartTime";
import { RandomTimer } from "@/utils/randomTimer";

export class NousAPIScheduler {
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
            console.info("Request limit reached. Stopping scheduler.");
            this.stop();
            return;
        }

        try {
            this.requestCount++;

            console.info(`Making scheduled request #${this.requestCount}`);

            let randomPrompt = "";
            
            try {
                randomPrompt = await getRandomPrompt();
            } catch (err) {
                console.info(`Request #${this.requestCount} to GEMINI has failed`, {
                    error: err,
                });
                process.exit(0);
            }

            const response = await this.apiClient.makeCustomRequest(randomPrompt);

            console.info(`Request #${this.requestCount} completed successfully`, {
                responsePreview: response.choices?.[0]?.message?.content,
            });
        } catch (error: any) {
            console.error(`Request #${this.requestCount} failed`, {
                error: error.message,
            });
        }
    }

    public start(): void {
        console.info("Starting Nous API Scheduler", {
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
                console.info("Runtime statistics", {
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
        console.info("Request limit reached. Resetting scheduler for the next day.");
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
        console.info(
            `Next run scheduled in ${Math.floor(delay / 1000 / 60)} minutes`,
        );

        setTimeout(() => {
            console.info("Starting new scheduler for the day");
            this.start();
        }, delay);
    }
}