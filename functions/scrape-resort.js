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
  let temp = null;
  let browser = null;
  try {
    browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://www.bluemountain.ca/", {
      waitUntil: ["domcontentloaded", "networkidle0"]
    });

    const tempSelector =
      "body > header > div.nav-right > div.condition-snippet-wrapper > div.condition-snippet > span.condition-snippet-description";
    temp = await page.$eval(tempSelector, el => el.textContent.trim());
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error
      })
    };
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close();
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      temp: temp
    })
  };
};
