# Vana Data Bot

This project automates task completion and auto-tapping for the Vana Data Hero game.

## Features
- Fetch player data and display points, multiplier, and other information.
- Automatically complete tasks and tap for points over a set period.
- Adjustable points mechanism for better task management.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- Access to the Vana Data Hero web app.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/ada682/vana-data.git

2. Navigate to the project directory:
   ```bash
   cd vana-data

3. Install dependencies:
   ```bash
   npm install

How to Obtain the Query String
 1.Open the Vana Data Hero web app and log in to your account.
 
 2.Open your browser's Developer Tools (right-click anywhere on the page and select "Inspect").
 
 3.Go to the Application tab in Developer Tools.
 
 4.In the left-hand sidebar, navigate to Storage > Session Storage.
 
 5.Select the Vana Data Hero session and look for the query data under sessionStorage.
 
 6.Copy the query string. It should look something like this:
   ```bash
    query_id=AAGu72pYAAAAAK7valgj4vxX&user=%7B%22id%22%3A1483403182%2C%22first_name%22%3A...
   ```

Editing index.js to Use the Query
1. Open the index.js file located in the project directory.

2. Find this line of code:
   ```bash
    const initData = 'query_id=AAGu72pYAAAAAK7valgj4vxX&user=%7B%22id%22%3A1483403182%2C...'; // Replace this with your actual query
   ```
3. Replace the existing query string with the one you copied from Session Storage.
   example
   ```bash
   const initData = 'your_copied_query_string_here';

4. Save the file.

Running the Bot
Once you have the query string in place, you can start the bot.

1. Run the following command to start the bot:
   ```bash
   npm start
2. The bot will display your player data and automatically complete tasks and tap for points over a 30-minute period.

License
This project is licensed under the MIT License. See the LICENSE file for details.







