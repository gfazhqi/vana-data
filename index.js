const { displayHeader, displayStatus } = require('./src/display');
const { getPlayerData, completePendingTasks, autoTap } = require('./src/api');
const { waitWithCountdown } = require('./src/display');

class Vana {
    async main() {
        displayHeader();
        
        const initData = 'query_id=AAGu72pYAAAAAK7valgj4vxX&user=%7B%22id%22%3A1483403182%2C%22first_name%22%3A%22%F0%9D%91%BE%F0%9D%92%90%F0%9D%92%8D%F0%9D%92%91%F0%9D%92%89%F0%9D%92%93%F0%9D%92%86%F0%9D%92%86%F0%9D%92%8F%20%7C%20Tomket%20Lovers%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22wolphreen7%22%2C%22language_code%22%3A%22id%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1726730419&hash=a37052ac78daa0d12c182499f7732e523ff8c184c7b9cfdb0ed3017551f510bd'; // Replace this with your actual query

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
