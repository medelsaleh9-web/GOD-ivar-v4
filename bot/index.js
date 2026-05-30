const { spawn } = require("child_process");
const { readFileSync } = require("fs");
const http = require("http");
const axios = require("axios");
const semver = require("semver");
const logger = require("./utils/log");
const express = require('express');
const path = require('path');
const chalk = require('chalkercli');
const chalk1 = require('chalk');
const CFonts = require('cfonts');
const app = express();
const port = process.env.PORT || 3000;
const moment = require("moment-timezone");
var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
if (thu == 'Sunday') thu = '𝐂𝐡𝐮̉ 𝐍𝐡𝐚̣̂𝐭'
if (thu == 'Monday') thu = '𝐓𝐡𝐮̛́ 𝐇𝐚𝐢'
if (thu == 'Tuesday') thu = '𝐓𝐡𝐮̛́ 𝐁𝐚'
if (thu == 'Wednesday') thu = '𝐓𝐡𝐮̛́ 𝐓𝐮̛'
if (thu == "Thursday") thu = '𝐓𝐡𝐮̛́ 𝐍𝐚̆𝐦'
if (thu == 'Friday') thu = '𝐓𝐡𝐮̛́ 𝐒𝐚́𝐮'
if (thu == 'Saturday') thu = '𝐓𝐡𝐮̛́ 𝐁𝐚̉𝐲'




console.log('ㅤㅤㅤㅤ            𝐇𝐨̂𝐦 𝐧𝐚𝐲 𝐥𝐚̀:' +  thu,'𝐂𝐡𝐮́𝐜 𝐛𝐚̣𝐧 𝐜𝐨́ 𝐦𝐨̣̂𝐭 𝐧𝐠𝐚̀𝐲 𝐯𝐮𝐢 𝐯𝐞̉\n' )



app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname, '/index.html'));

});


const server = app.listen(port, () => {
    console.log('𝐌𝐚́𝐲 𝐜𝐡𝐮̉ 𝐛𝐚̆́𝐭 𝐝𝐚̂̀𝐮 𝐭𝐚̣𝐢 http://localhost:' + port, "𝐯𝐚̀𝐨 𝐥𝐮́𝐜:" + gio, "\n\n");
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, releasing it...`);
        require('child_process').exec(`fuser -k ${port}/tcp`, () => {
            setTimeout(() => {
                server.listen(port, () => {
                    console.log('𝐌𝐚́𝐲 𝐜𝐡𝐮̉ 𝐛𝐚̆́𝐭 𝐝𝐚̂̀𝐮 𝐭𝐚̣𝐢 http://localhost:' + port, "𝐯𝐚̀𝐨 𝐥𝐮́𝐜:" + gio, "\n\n");
                });
            }, 1000);
        });
    } else {
        throw err;
    }
});


logger("𝐋𝐢𝐞̂𝐧 𝐡𝐞̣̂ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤: https://www.facebook.com/TatsuYTB", "𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤");


const rainbow = chalk.rainbow(`\nㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ『=== TatsuYTB  ===』\n\n`).stop();
rainbow.render();
const frame = rainbow.frame(); 
console.log(frame);
logger("𝕐𝕠𝕦𝕣 𝕧𝕖𝕣𝕤𝕚𝕠𝕟 𝕚𝕤 𝕥𝕙𝕖 𝕝𝕒𝕥𝕖𝕤𝕥!", "UPDATE");


let restartCount = 0;
let lastRestartTime = Date.now();
let lastStartTime = Date.now();
const MAX_RESTARTS = 10;
const RESTART_WINDOW = 5 * 60 * 1000;
const MIN_RESTART_DELAY = 5000;
const STABLE_RUN_THRESHOLD = 5 * 60 * 1000; // reset backoff if ran >5 min

function getBackoffDelay(count) {
    // Exponential backoff: 5s, 10s, 20s, 40s, ... capped at 5 minutes
    const base = MIN_RESTART_DELAY;
    const delay = Math.min(base * Math.pow(2, Math.max(0, count - 1)), 5 * 60 * 1000);
    return delay;
}

function startBot(message) {
    (message) ? logger(message, "BOT STARTING") : "";

    const now = Date.now();

    // If the last child ran for longer than STABLE_RUN_THRESHOLD, it was healthy — reset backoff
    const ranFor = now - lastStartTime;
    if (ranFor > STABLE_RUN_THRESHOLD) {
        restartCount = 0;
    }

    // Rolling window check
    if (now - lastRestartTime > RESTART_WINDOW) {
        restartCount = 0;
        lastRestartTime = now;
    }

    if (restartCount >= MAX_RESTARTS) {
        logger("Too many restarts in a short time. Waiting 2 minutes before next attempt...", "[ PROTECTION ]");
        setTimeout(() => {
            restartCount = 0;
            lastRestartTime = Date.now();
            startBot("Resuming after cooldown...");
        }, 2 * 60 * 1000);
        return;
    }

    restartCount++;
    lastStartTime = Date.now();

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main-loader.cjs"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: false
    });

    child.on("close", async (codeExit) => {
        if (codeExit === 1) {
            // Normal restart requested (e.g. appstate refreshed, warning cleared)
            const delay = getBackoffDelay(restartCount);
            await new Promise(resolve => setTimeout(resolve, delay));
            return startBot("BOT RESTARTING!!!");
        } else if (typeof codeExit === 'number' && codeExit >= 20 && codeExit <= 299) {
            // Encoded delay restart: code 2XX where XX is seconds to wait
            const delaySecs = codeExit - 20;
            const delay = Math.max(delaySecs * 1000, MIN_RESTART_DELAY);
            await new Promise(resolve => setTimeout(resolve, delay));
            startBot("Bot has been activated please wait a moment!!!");
        } else {
            // Exit code 0 or other — do not restart
            return;
        }
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
        setTimeout(() => startBot("Restarting after error..."), getBackoffDelay(restartCount));
    });
};
axios.get("https://raw.githubusercontent.com/tandung1/Bot12/main/package.json").then((res) => {
    //logger(res['data']['name'], "[ TÊN PR0JECT ]");
    //logger("Version: " + res['data']['version'], "[ PHIÊN BẢN ]");
    //logger(res['data']['description'], "[ LƯU Ý ]");
})
setTimeout(async function () {
//CFonts.say('Maris v3', {
    //font: 'block',
      //align: 'center',
  //gradient: ['red', 'magenta']
    //})
//CFonts.say(`Bot Messenger Created By Vtuan`, {
    //font: 'console',
    //align: 'center',
    //gradient: ['red', 'magenta']
    //})
  //CFonts.say('Vtuan\n', {
    //font: 'block',
      //align: 'center',
  //gradient: ['red', 'magenta']
    //})

rainbow.render(); 

const frame = rainbow.frame(); 
console.log(frame);

  logger('𝐁𝐚̆́𝐭 𝐝𝐚̂̀𝐮 𝐥𝐨𝐚𝐝 𝐬𝐨𝐮𝐫𝐜𝐞 𝐜𝐨𝐝𝐞', 'LOAD')
  startBot()
}, 70)