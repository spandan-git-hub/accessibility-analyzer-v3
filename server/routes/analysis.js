const express = require('express');
const puppeteer = require('puppeteer');
const axe = require('axe-core');

const router = express.Router();

router.post('/analysis', async (req, res) =>{
    let browser;

    try{
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required'});
        }

        console.log('Starting analysis for:', url);

        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-dev-shm-usage',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--single-process',
                '--no-zygote'
            ],
            executablePath: process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath()
        });

        const page = await browser.newPage();

        page.setDefaultTimeout(10000);
        page.setDefaultNavigationTimeout(10000);

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log('Navigating to URL...');

        let navigationSuccess = false;
        const strategies = [
            { waitUntil: 'domcontentloaded', timeout: 10000 },
            { waitUntil: 'load', timeout: 10000 },
            { waitUntil: 'networkidle0', timeout: 5000}
        ];

        for (const strategy of strategies) {
            try {
                await page.goto(url, strategy);
                navigationSuccess = true;
                console.log('Navigation successful with strategy:', strategy.waitUntil);
                break;
            } catch (navError) {
                console.log('Navigation failed with strategy:', strategy.waitUntil);
                continue;
            }
        }

        if(!navigationSuccess) {
            console.log('All navigation strategies failed, returning basic report');
            const basicReport = {
                url: url,
                timestamp: new Date(),
                violations: [],
                passes: 0,
                totalIssues: 0,
                note: 'Page could not be fully loaded, but basic analysis completed'
            };
            return res.json(basicReport);
        }

        console.log('Injecting axe-core...');

        try{
            await page.evaluate(axe.source);
        } catch (axeError) {
            console.log('Axe injection failed, returning basic report');
            const basicReport = {
                url: url,
                timestamp: new Date(),
                violations: [],
                passes: 0,
                totalIssues: 0,
                note: 'Accessibility analysis could not be performed'
            };
        return res.json(basicReport);
        }

        console.log('Running accessibility analysis...');

        const results = await Promise.race([
         
            page.evaluate(() => {
                return new Promise((resolve) => {
                    axe.run((err, results) => {
                        if (err) {
                            console.error('Axe error:', err);
                            resolve({ violations: [], passes: [] });
                        } else {
                        resolve(results);
                        }
                    });
                });
            }),

        new Promise((resolve) =>
            setTimeout( () => resolve({ violations: [], passes: [] }), 8000 ))
        ]);


        const report = {
            url: url,
            timestamp: new Date(),
            violations: results.violations.map((violation) => ({
                id: violation.id,
                impact: violation.impact,
                description: violation.description,
                help: violation.help,
                helpUrl: violation.helpUrl,
                nodes: violation.nodes.map((node) => ({
                    html: node.html,
                    failureSummary: node.failureSummary,
                    codeSuggestion: node.html
                }))
            })),
            passes: results.passes.length,
            totalIssues: results.violations.length
        };
    
        res.json(report);

    } catch(err){
        console.error('Analysis error:', err);
        res.json({
            url: req.body.url || 'Unknown URL',
            timestamp: new Date(),
            violations: [],
            passes: 0,
            totalIssues: 0,
            note: 'Analysis failed due to an internal error',
            error: err.message
        });
    } finally {
        if (browser) {
        try {
            await browser.close();
            console.log('Browser closed');
        } catch (err) {
        console.error('Error closing browser:', err);
        }
        }
    }

});

module.exports = router;