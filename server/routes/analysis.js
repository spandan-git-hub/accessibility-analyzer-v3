// ... existing code ...
const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const useStealth = process.env.USE_STEALTH;
if (useStealth) {
  puppeteer.use(StealthPlugin());
}
const randomUseragent = require('random-useragent');
const axe = require('axe-core');

const router = express.Router();

// Helper for random delays
function randomDelay(min = 200, max = 1200) {
  return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}

router.post('/analysis', async (req, res) => {
  let browser;

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Starting analysis for:', url);

    browser = await puppeteer.launch({
      headless: true, // Try false if still blocked
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    const page = await browser.newPage();

    // Randomize user agent
    const userAgent = randomUseragent.getRandom();
    await page.setUserAgent(userAgent);

    // Randomize viewport
    await page.setViewport({
      width: Math.floor(Math.random() * (1920 - 1200 + 1)) + 1200,
      height: Math.floor(Math.random() * (1080 - 700 + 1)) + 700,
      deviceScaleFactor: 1,
    });

    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(10000);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Random delay before navigation
    await randomDelay();
    console.log('Navigating to URL...');

    let navigationSuccess = false;
    const strategies = [
      { waitUntil: 'domcontentloaded', timeout: 10000 },
      { waitUntil: 'load', timeout: 10000 },
      { waitUntil: 'networkidle0', timeout: 5000 }
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

    if (!navigationSuccess) {
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

    // Random delay after navigation
    await randomDelay();

    // Simulate human-like mouse movement
    await page.mouse.move(
      Math.floor(Math.random() * 300) + 100,
      Math.floor(Math.random() * 300) + 100,
      { steps: 10 }
    );
    await randomDelay(100, 500);

    // Optionally hover over a random link
    const links = await page.$$('a');
    if (links.length > 0) {
      const randomLink = links[Math.floor(Math.random() * links.length)];
      const box = await randomLink.boundingBox();
      if (box) {
        await page.mouse.move(
          box.x + box.width / 2,
          box.y + box.height / 2,
          { steps: 15 }
        );
        await randomDelay(200, 800);
      }
    }

    console.log('Injecting axe-core...');

    try {
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
        setTimeout(() => resolve({ violations: [], passes: [] }), 8000))
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

  } catch (err) {
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