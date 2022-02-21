const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");
const axios = require("axios")

const fetchData = async () => {
    try {
        const res = await axios.get("https://admin.hellotars.com/chatbot-templates/lead-generation");
        return res.data
    } catch (error) {
        console.error(error)
        return {}
    }
}


const handler = async () => {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: true,
        timeout: 100000
    });

    const data = await fetchData();
    const convbots = data.convbots;
    const page = await browser.newPage();
    for (const val of convbots) {
        page.setDefaultNavigationTimeout(0);
        const url = `https://chatbot.hellotars.com/conv/${val.convid}/`;
        await page.emulate(puppeteer.devices['iPhone SE'])
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(10000);
        const imageBuffer = await page.screenshot({ path: `images/${val.convid}.png`, fullPage: true });
        // console.log(imageBuffer.toString('base64'))
    }
    await browser.close()
}

handler().then(() => console.log('done')).catch(err => console.error(err))