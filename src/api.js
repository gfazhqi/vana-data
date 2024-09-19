const axios = require('axios');
const { headers } = require('./headers');
const { displayStatus } = require('./display');

class VanaAPI {
    constructor(initData) {
        this.initData = initData;
        this.successCount = 0;
        this.failureCount = 0;
        this.miningCount = 0;
        this.totalPoints = 0;
        this.basePoints = 1500;
        this.maxAllowedPoints = 1800;
        this.minBasePoints = 1400;
        this.adjustmentStep = 3;
    }

    async getPlayerData() {
        const url = 'https://www.vanadatahero.com/api/player';
        try {
            const response = await axios.get(url, { headers: headers(this.initData) });
            console.log(`[${this.initData}] -> Successfully Get Player Info`);
            this.totalPoints = response.data.points;
            console.log(`[${this.initData}] Points: ${this.totalPoints}`);
            return response.data;
        } catch (error) {
            this.handleApiError('Error fetching player data', error);
            return null;
        }
    }

    async completePendingTasks() {
        const url = 'https://www.vanadatahero.com/api/tasks';
        try {
            const response = await axios.get(url, { headers: headers(this.initData) });
            const tasks = response.data.tasks.filter(task => ![1, 17, 5].includes(task.id));

            for (const task of tasks) {
                if (task.completed.length === 0) {
                    console.log(`[${this.initData}] -> Try to Completing Task ${task.name}`);
                    const taskUrl = `https://www.vanadatahero.com/api/tasks/${task.id}`;
                    const payload = { status: 'completed', points: task.points };

                    try {
                        await axios.post(taskUrl, payload, { headers: headers(this.initData) });
                        this.successCount++;
                        console.log(`[${this.initData}] -> Task ${task.name} Completed | Earned: ${task.points}`.green);
                    } catch (error) {
                        this.handleApiError(`Failed to Complete task ${task.name}`, error);
                    }
                }
            }
        } catch (error) {
            this.handleApiError('Error fetching tasks', error);
        }
    }

    async autoTap() {
        const taskId = 1;
        const variation = Math.floor(Math.random() * 8);
        const points = Math.min(this.basePoints + variation, this.maxAllowedPoints);

        const url = `https://www.vanadatahero.com/api/tasks/${taskId}`;
        const payload = { status: 'completed', points: points };

        try {
            await axios.post(url, payload, { headers: headers(this.initData) });
            this.successCount++;
            this.miningCount++;
            this.totalPoints += points;
            displayStatus(this.successCount, this.failureCount);
            console.log(`[${this.initData}] -> Successfully Tapping for: ${points} points`.green);
            
            if (this.basePoints < this.maxAllowedPoints - 10) {
                this.basePoints = Math.min(this.basePoints + this.adjustmentStep, this.maxAllowedPoints - 10);
            }
            
            if (this.miningCount % 5 === 0) {
                console.log(`[${this.initData}] Total Points after ${this.miningCount} tapping operations: ${this.totalPoints}`.cyan);
                console.log(`[${this.initData}] Current base points: ${this.basePoints}`.yellow);
            }
            return true;
        } catch (error) {
            return this.handleTapError(error);
        }
    }

    handleApiError(context, error) {
        this.failureCount++;
        if (error.response) {
            console.error(`[${this.initData}] ${context}: ${error.response.status} - ${error.response.statusText}`);
            console.log(`[${this.initData}] Full error response:`, error.response.data);
        } else if (error.request) {
            console.error(`[${this.initData}] ${context}: No response received from the server.`);
        } else {
            console.error(`[${this.initData}] ${context}: ${error.message}`);
        }
    }

    handleTapError(error) {
        this.failureCount++;
        displayStatus(this.successCount, this.failureCount);

        if (error.response) {
            if (error.response.data.message === 'Points limit exceeded') {
                console.error(`[${this.initData}] Points limit exceeded, stopping auto-tap.`);
                return false;
            } else if (error.response.data.message === 'Incorrect points value') {
                console.error(`[${this.initData}] Incorrect points value, adjusting base points.`.red);
                this.basePoints = Math.max(this.basePoints - this.adjustmentStep * 2, this.minBasePoints);
                console.log(`[${this.initData}] Adjusted base points to: ${this.basePoints}`.yellow);
            } else {
                this.handleApiError('Error during auto-tap', error);
            }
        } else {
            this.handleApiError('Error during auto-tap', error);
        }
        return true;
    }
}

module.exports = VanaAPI;
