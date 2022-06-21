import { expect } from "chai";
import puppeteer from "puppeteer";
import 'dotenv/config'

describe("chart component basic functionality test", () => {
    let browser:puppeteer.Browser;
    let page:puppeteer.Page;

    beforeEach(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto(`file://${ process.env.APP_ROOT }/test.html`);
    });

    afterEach(async () => {
        await browser.close();
    });

    it("should have the correct page title", async () => {
        expect(await page.title()).to.eql("Test Html Page");
    });

    it("should show graph when graph web component is added", async () => {

        const importComponent = await page.evaluate(() => {
            const newScript = document.createElement('script');
            newScript.type = 'module';
            newScript.src = 'components/charts/bar-chart.js';
            document.getElementsByTagName("head")[0].appendChild(newScript);
        });

        const displayComponent = await page.evaluate(() => {
            const testElement = document.createElement('bar-chart');
            document.body.appendChild(testElement);
        });
        await page.waitForSelector("bar-chart");
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("bar-chart"));
        });
        expect(links.length).to.be.greaterThan(0);
    });
});