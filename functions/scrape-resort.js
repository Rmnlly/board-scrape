// Event signature
// {
//   "path": "Path parameter",
//   "httpMethod": "Incoming request's method name"
//   "headers": {Incoming request headers}
//   "queryStringParameters": {query string parameters }
//   "body": "A JSON string of the request payload."
//   "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
// }

const chromium = require("chrome-aws-lambda");

exports.handler = async (event, context) => {
  // const { site } = event.queryStringParamaters;

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await page.goto("https://www.bluemountain.ca/");
  const tempSelector =
    "body > header > div.nav-right > div.condition-snippet-wrapper.opened > div.conditions-dropdown > div > div > div > div.conditions-weather.conditions-section > div.weather-wrapper > div.weather-current > div.weather-conditions > div > div > div > div.switchable-stat > span.switchable-stat-item.switchable-stat-metric";
  const temp = await page.$eval(tempSelector, el => el.textContent.trim());
  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({
      temp
    })
  };
};
