const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "/.tmp"
  });
  const page = await browser.newPage();

  await page.goto('https://www.pararius.com/apartments/amsterdam/sort-price-low');

  const searchList = await page.$$("ul.search-list > li.search-list__item--listing ");
  const results = [];
  for (const listingBox of searchList) {
    try {
      const title = await page.evaluate(el => el.querySelector(".listing-search-item__title > a").textContent.trim(), listingBox);
      const price = await page.evaluate(el => el.querySelector(".listing-search-item__price").textContent.trim(), listingBox);
      const link = await page.evaluate(el => el.querySelector(".listing-search-item__title > a").href, listingBox);
      
      const listingInfo = { title, price, link };

      results.push(listingInfo);
    } catch (error) {}
  }

  const resultsJson = JSON.stringify(results, null, 2);
  console.log(resultsJson);

  fs.writeFile('output.txt', resultsJson, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data written to output.txt successfully.');
    }
  });

  await browser.close();
})();
