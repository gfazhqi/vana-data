const { displayHeader, displayStatus } = require('./src/display');
const { getPlayerData, completePendingTasks, autoTap } = require('./src/api');
const { waitWithCountdown } = require('./src/display');

class Vana {
    async main() {
        displayHeader();
        
        const initData = 'your-query-here'; // Replace this with your actual query

        try {
            const playerData = await getPlayerData(initData);
            if (playerData) {
                console.log(`========== Running for account | ${playerData.tgFirstName} ==========`.green);
                console.log(`Points: ${playerData.points}`.green);
                console.log(`Multiplier: ${playerData.multiplier}`.green);
            } else {
                console.log('Error: Could not retrieve player data'.red);
            }

            await completePendingTasks(initData);

            const totalTime = 30 * 60 * 1000; 
            let elapsedTime = 0;
            const delay = 20000;

            while (elapsedTime < totalTime) {
                console.log(`Delaying for 20 Seconds Before Tapping...`);
                await waitWithCountdown(20);
                const shouldContinue = await autoTap(initData);
                if (!shouldContinue) break;
                elapsedTime += delay;
            }

            console.log(`Successfully Tapped for 30 Minutes`);
            console.log(`ACCOUNT Process complete`);
        } catch (error) {
            console.error('Error during execution: ', error.message);
        }
    }
}

if (require.main === module) {
    const vana = new Vana();
    vana.main().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
