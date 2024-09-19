const fs = require('fs').promises;
const path = require('path');
const { displayHeader, displayStatus } = require('./src/display');
const { getPlayerData, completePendingTasks, autoTap } = require('./src/api');
const { waitWithCountdown } = require('./src/display');

class Vana {
    constructor(initData) {
        this.initData = initData;
    }

    async run() {
        try {
            const playerData = await getPlayerData(this.initData);
            if (playerData) {
                console.log(`========== Running for account | ${playerData.tgFirstName} ==========`.green);
                console.log(`Points: ${playerData.points}`.green);
                console.log(`Multiplier: ${playerData.multiplier}`.green);
            } else {
                console.log('Error: Could not retrieve player data'.red);
                return;
            }

            await completePendingTasks(this.initData);

            const totalTime = 30 * 60 * 1000; 
            let elapsedTime = 0;
            const delay = 20000;

            while (elapsedTime < totalTime) {
                console.log(`Delaying for 20 Seconds Before Tapping...`);
                await waitWithCountdown(20);
                const shouldContinue = await autoTap(this.initData);
                if (!shouldContinue) break;
                elapsedTime += delay;
            }

            console.log(`Successfully Tapped for 30 Minutes`);
            console.log(`ACCOUNT Process complete for ${playerData.tgFirstName}`);
        } catch (error) {
            console.error(`Error during execution for account: ${error.message}`);
        }
    }
}

async function readAccountsFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        console.error('Error reading data.txt file:', error.message);
        return [];
    }
}

async function runMultipleAccounts(accounts) {
    displayHeader();
    
    for (const account of accounts) {
        const vana = new Vana(account);
        await vana.run();
        console.log('\n'); // Add a newline between accounts for better readability
    }

    console.log("All accounts processed.");
}

if (require.main === module) {
    const dataFilePath = path.join(__dirname, 'data.txt');

    readAccountsFromFile(dataFilePath)
        .then(accounts => {
            if (accounts.length === 0) {
                console.log('No accounts found in data.txt. Please add account queries to the file.');
                process.exit(1);
            }
            return runMultipleAccounts(accounts);
        })
        .catch(err => {
            console.error('Error in main execution:', err);
            process.exit(1);
        });
}
