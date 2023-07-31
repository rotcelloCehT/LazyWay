const puppeteer = require('puppeteer');


// Function to write the variable to a .txt file
function writeToFile(variableValue, filename) {
  fs.writeFile(filename, variableValue, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Variable written to file successfully.');
    }
  });
}



(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "/.tmp"
  });
  const page = await browser.newPage();

  await page.goto('https://www.pararius.com/apartments/amsterdam/sort-price-low');
  
  // let's just call them listingHandle 
  const searchList = await page.$$("ul.search-list > li.search-list__item--listing ");
  for(const listingBox of searchList){
    // pass the single handle below
    try {
      const title = await page.evaluate(el => el.querySelector(".listing-search-item__title > a").textContent.trim(), listingBox)
      console.log(title)
      
      const price = await page.evaluate(el => el.querySelector(".listing-search-item__price").textContent.trim(), listingBox)
      console.log(price)

      const link = await page.evaluate(el => el.querySelector(".listing-search-item__title > a").href, listingBox)
      console.log(link)

    } catch (error) {}
 }
  // await writeToFile(results, 'output.txt');
  await browser.close();

})();