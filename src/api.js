const axios = require('axios');
const { headers } = require('./headers');
const { displayStatus } = require('./display');

let successCount = 0;
let failureCount = 0;
let miningCount = 0;
let totalPoints = 0;
let basePoints = 1500; 
const maxAllowedPoints = 1800;
const minBasePoints = 1400; 
const adjustmentStep = 3; 

async function getPlayerData(initData) {
    const url = 'https://www.vanadatahero.com/api/player';
    try {
        const response = await axios.get(url, { headers: headers(initData) });
        console.log(`-> Successfully Get Player Info`);
        totalPoints = response.data.points;
        console.log(`Points: ${totalPoints}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player data:', error.message);
        if (error.response && error.response.status === 400) {
            console.log(error.response.data.message);
        } else {
            console.log(`-> Error Get Player Info : ${error.response.status}-${error.response.statusText}`);
        }
    }
}

async function completePendingTasks(initData) {
    const url = 'https://www.vanadatahero.com/api/tasks';
    try {
        const response = await axios.get(url, { headers: headers(initData) });
        const tasks = response.data.tasks.filter(task => task.id !== 1 && task.id !== 17 && task.id !== 5);

        for (const task of tasks) {
            if (task.completed.length === 0) {
                console.log(`-> Try to Completing Task ${task.name}`);
                const taskUrl = `https://www.vanadatahero.com/api/tasks/${task.id}`;
                const payload = { status: 'completed', points: task.points };

                try {
                    await axios.post(taskUrl, payload, { headers: headers(initData) });
                    successCount++;
                    console.log(`-> Task ${task.name} Completed | Earned: ${task.points}`.green);
                } catch (error) {
                    failureCount++;
                    if (error.response && error.response.status === 400) {
                        console.log(error.response.data.message);
                    } else {
                        console.log(`-> Failed to Complete task ${task.name} : ${error.response.status}-${error.response.statusText}`.red);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error fetching tasks: ', error.message);
    }
}

async function autoTap(initData) {
    const taskId = 1;
    const variation = Math.floor(Math.random() * 8); 
    const points = Math.min(basePoints + variation, maxAllowedPoints);

    const url = `https://www.vanadatahero.com/api/tasks/${taskId}`;
    const payload = { status: 'completed', points: points };

    try {
        await axios.post(url, payload, { headers: headers(initData) });
        successCount++;
        miningCount++;
        totalPoints += points;
        displayStatus(successCount, failureCount);
        console.log(`-> Successfully Start Mining for: ${points} points`.green);
        
        if (basePoints < maxAllowedPoints - 10) {
            basePoints = Math.min(basePoints + adjustmentStep, maxAllowedPoints - 10);
        }
        
        if (miningCount % 5 === 0) {
            console.log(`Total Points after ${miningCount} mining operations: ${totalPoints}`.cyan);
            console.log(`Current base points: ${basePoints}`.yellow);
        }
    } catch (error) {
        failureCount++;
        displayStatus(successCount, failureCount);

        if (error.response) {
            if (error.response.data.message === 'Points limit exceeded') {
                console.error('Points limit exceeded, stopping auto-tap.');
                return false;
            } else if (error.response.data.message === 'Incorrect points value') {
                console.error('Incorrect points value, adjusting base points.'.red);
                basePoints = Math.max(basePoints - adjustmentStep * 2, minBasePoints);
                console.log(`Adjusted base points to: ${basePoints}`.yellow);
            } else {
                console.error(`Error during auto-tap: ${error.response.status} - ${error.response.statusText}`);
            }
            console.log('Full error response:', error.response.data);
        } else if (error.request) {
            console.error('Error: No response received from the server.');
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
    return true;
}

module.exports = { getPlayerData, completePendingTasks, autoTap };
