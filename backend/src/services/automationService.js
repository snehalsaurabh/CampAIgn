const puppeteer = require('puppeteer');

const CHROME_PROFILE = 'Profile 9';
const USER_DATA_DIR = `${process.env.LOCALAPPDATA}\\Google\\Chrome\\User Data`;
const CHROME_EXECUTABLE_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const createCampaign = async (campaignContent) => {
  let browser;
  let page;
  
  try {
    console.log(`Launching Chrome with profile "${CHROME_PROFILE}"...`);
    browser = await puppeteer.launch({
      headless: false,
      executablePath: CHROME_EXECUTABLE_PATH,
      defaultViewport: null,
      args: [
        `--user-data-dir=${USER_DATA_DIR}`,
        `--profile-directory=${CHROME_PROFILE}`,
        '--remote-debugging-port=9222',
        '--start-maximized'
      ]
    });

    console.log('Chrome launched successfully');
    page = await browser.newPage();
    
    await page.goto('https://ads.google.com/aw/home', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Multiple selector strategies in priority order
    const selectors = [
      // XPath
      '/html/body/div[1]/root/div/div[1]/div[2]/div/div[3]/div/div/awsm-child-content/content-main/div/div/overview-lite-root/overview-ipl/div/div[2]/div/span',
      // CSS Selector
      '#overview_liteExtensionPoint > overview-lite-root > overview-ipl > div > div.top-widgets._ngcontent-ebi-1 > div > span',
      // Text content
      'span:has-text("New campaign")',
      // Class based
      'span._ngcontent-ebi-1'
    ];

    let clicked = false;
    
    for (const selector of selectors) {
      try {
        if (selector.startsWith('/')) {
          // XPath approach
          await page.waitForXPath(selector, { visible: true, timeout: 5000 });
          const [element] = await page.$x(selector);
          if (element) {
            await element.click();
            clicked = true;
            console.log('Clicked using XPath');
            break;
          }
        } else {
          // CSS Selector approach
          await page.waitForSelector(selector, { visible: true, timeout: 5000 });
          await page.click(selector);
          clicked = true;
          console.log('Clicked using CSS selector');
          break;
        }
      } catch (err) {
        console.log(`Failed with selector: ${selector}`);
        continue;
      }
    }

    if (!clicked) {
      throw new Error('Failed to click New Campaign button with all selectors');
    }

    // Wait for navigation after click
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

  } catch (error) {
    console.error('Automation Error:', error);
    throw new Error(`Automation Failed: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
};

// Test function
const testAutomation = async () => {
  console.log('🚀 Starting automation test...');
  try {
    await createCampaign({});
    console.log('✅ Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\nTo fix:');
    console.log('1. Ensure Chrome is closed before running the script');
    console.log('2. Run this test again');
  }
};

// Allow direct execution
if (require.main === module) {
  testAutomation();
}

module.exports = { createCampaign, testAutomation };