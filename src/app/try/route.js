import { NextResponse } from "next/server";

const localExecutablePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar";

const isDev = process.env.NODE_ENV === "development";

export async function GET() {
  let browser = null;
  try {
    // const chromium = require("@sparticuz/chromium-min");
    const { chromium: playwright } = require("playwright-core");

    // const puppeteer = require("puppeteer-core");
    const chromium = require("@sparticuz/chromium");


    const browser = await playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://baidu.com");
    const pageTitle = await page.title();
    await browser.close();
  
    // or just use new Response ❗️
    return new NextResponse(pageTitle, { status: 200, statusText: "OK", headers });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await browser.close();
  }
}
