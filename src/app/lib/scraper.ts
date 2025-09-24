// src/app/lib/scraper.ts
// Use puppeteer-extra and the stealth plugin
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

// Apply the stealth plugin
puppeteer.use(StealthPlugin());

export interface ScrapedPropertyData {
  estimatedValue: string | null;
  address: string | null;
  bedBathSqft: string | null;
  propertyDetails: object | null;
}

// Helper function to format the address for Realtor.com's URL structure
function formatAddressForUrl(address: string): string {
  return address.replace(/,/g, '').replace(/\s+/g, '-');
}

export async function scrapeRealtor(fullAddress: string): Promise<ScrapedPropertyData | null> {
  console.log(`Scraping Realtor.com for address: ${fullAddress}`);
  if (!fullAddress) {
    console.error("Address is empty, skipping scrape.");
    return null;
  }
  let browser;

  try {
    const formattedAddress = formatAddressForUrl(fullAddress);
    const targetUrl = `https://www.realtor.com/realestateandhomes-detail/${formattedAddress}`;
    console.log(`Navigating directly to: ${targetUrl}`);

    // Launch the stealth-configured puppeteer
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );

    await page.goto(targetUrl, { waitUntil: "networkidle2" });
    
    const html = await page.content();
    const $ = cheerio.load(html);

    const mainAddress = $('[data-testid="main-address"]').text().trim();
    if (!mainAddress) {
        console.error("Could not find property details. The page may be a 'no results' page or a CAPTCHA.");
        await page.screenshot({ path: 'realtor_error.png' });
        throw new Error("Failed to find property details on the target page.");
    }

    // --- DATA EXTRACTION ---
    const estimatedValue = $('[data-testid="on-market-price-details"] > div > h3').text().trim() || null;
    
    const bedBathSqftParts: string[] = [];
    $('[data-testid="property-meta-list-container"] li').each((i, el) => {
        bedBathSqftParts.push($(el).text().trim());
    });
    const bedBathSqft = bedBathSqftParts.join(', ') || null;

    const details: { [key: string]: string } = {};
    $('div[data-testid="property-detail-body"] > div > ul > li').each((i, el) => {
        const key = $(el).find('span').first().text().trim();
        const value = $(el).find('span').last().text().trim();
        if (key && value) {
            details[key] = value;
        }
    });

    const scrapedData: ScrapedPropertyData = {
      estimatedValue,
      address: mainAddress,
      bedBathSqft,
      propertyDetails: Object.keys(details).length > 0 ? details : null,
    };

    console.log("Scraping successful:", scrapedData);
    return scrapedData;

  } catch (error) {
    console.error("Error during scraping:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}