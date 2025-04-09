import cron from "node-cron";
import puppeteer from "puppeteer";

import { Op } from "sequelize";
import { PasswordRecovery, Product } from "../src/models/index.js";

// "*/30 * * * *"
const tokenExpiryCheck = cron.schedule("*/30 * * * *", async () => {
  console.log("Token expiry check is starting...");

  try {
    const toBeExpiredTokens = await PasswordRecovery.findAll({
      where: {
        createdAt: { [Op.lt]: new Date(Date.now() - 30 * 60 * 1000) },
        claimedAt: null,
      },
    });

    for (const token of toBeExpiredTokens) {
      token.expiredAt = new Date();
      await token.save();
    }

    console.log("Expired tokens marked as expired:", toBeExpiredTokens.length);
  } catch (error) {
    console.error("Error marking expired tokens:", error);
  }
});

// "*/5 9-18 * * 1-5"
const fetchPricesForProducts = cron.schedule(
  "*/5 9-18 * * 1-5",
  async () => {
    console.log(
      `[${new Date().toISOString()}] Price fetching job is starting...`
    );

    try {
      const products = await Product.findAll();

      for (const product of products) {
        const symbol = product.id + "1!";
        const price = await fetchPriceForSymbol(symbol);

        if (!price) {
          console.warn(
            `[${new Date().toISOString()}] Price for ${
              product.id
            } could not be updated.`
          );
          continue;
        }

        if (product.price !== price) {
          product.price = price;
          product.priceLastUpdatedAt = new Date();
          await product.save();
          console.log(
            `[${new Date().toISOString()}] Updated ${
              product.id
            } product price to ${product.price}.`
          );
        }
      }
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] Error in price fetching job:`,
        err
      );
    }

    console.log(`[${new Date().toISOString()}] Price fetching job finished!`);
  },
  {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  }
);

const fetchPriceForSymbol = async (symbol) => {
  const url = `https://br.tradingview.com/symbols/BMFBOVESPA-${symbol}`;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });

    await page.waitForFunction(
      () => {
        const element = document.querySelector(".js-symbol-last");
        return element && element.textContent.trim() !== "";
      },
      { timeout: 5000 }
    );

    const priceStr = await page.$eval(".js-symbol-last", (element) =>
      element.textContent.trim()
    );
    const price = parseFloat(priceStr.replace(",", "."));

    return price;
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error scraping TradingView for ${symbol}:`,
      error
    );
    return null;
  } finally {
    if (browser) {
      await browser
        .close()
        .catch((err) => console.error("Error closing browser:", err));
    }
  }
};

export { tokenExpiryCheck, fetchPricesForProducts };
