// Function to get a random start time within the day
export function getRandomStartTime(): Date {
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
export function getDelayUntilNextStartTime(): number {
    const now = new Date();
    const randomStartTime = getRandomStartTime();
    if (randomStartTime < now) {
        randomStartTime.setDate(randomStartTime.getDate() + 1);
    }
    return randomStartTime.getTime() - now.getTime();
}