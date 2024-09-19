const readline = require('readline');
const colors = require('colors');

function displayHeader() {
    console.log('======================================'.green);
    console.log('         Vana t.me/slyntherinnn       '.green);
    console.log('======================================'.green);
}

function displayStatus(successCount, failureCount) {
    console.log(`Success: ${successCount} | Failure: ${failureCount}`);
}

async function waitWithCountdown(seconds) {
    for (let i = seconds; i >= 0; i--) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`[*] Please wait ${i} seconds for the next action`.yellow);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log('');
}

module.exports = { displayHeader, displayStatus, waitWithCountdown };
