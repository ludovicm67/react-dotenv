#!/usr/bin/env node

import { readFileSync, writeFileSync, access, constants } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { load } from "cheerio";
import { format } from "prettier";
import get from "lodash/get.js";
import pick from "lodash/pick.js";

const dir = dirname(fileURLToPath(import.meta.url));

const patchIndexHtml = async (html, publicUrl = '/') => {
  let $ = load(html);

  if ($("script#react-dotenv").length) {
    $("script#react-dotenv").attr("src", `${publicUrl}/env.js`);
  } else {
    $("head").append(`\t<script id="react-dotenv" src="${publicUrl}/env.js"></script>\n\t`);
  }

  return format($.html(), { parser: "html" });
}

const reactAppPath = "../../../..";

/** Load app's package.json */
const appPackage = JSON.parse(readFileSync(resolve(dir, `${reactAppPath}/package.json`)));

/** Load app's .env file */
config({ path: resolve(dir, `${reactAppPath}/.env`), quiet: true });

/**
 * Read environment variables whitelist
 * from the app's package.json
 **/
const whitelist = get(appPackage, "react-dotenv.whitelist", []);

/**
 * Check for custom homepage (basepath)
 * More Info: https://create-react-app.dev/docs/deployment/#building-for-relative-paths
 */
const homepage = get(appPackage, "homepage", "%PUBLIC_URL%");

/**
 * Remove all environment variables
 * not included in the whitelist
 */
const env = whitelist.length ? pick(process.env, whitelist) : process.env;

const envFile = `window.env = ${JSON.stringify(env, null, 2)};`;

writeFileSync(resolve(dir, `${reactAppPath}/public/env.js`), envFile);

access(resolve(dir, `${reactAppPath}/build`), constants.W_OK, (err) => {
  if (err) return;
  writeFileSync(resolve(dir, `${reactAppPath}/build/env.js`), envFile);
});

/**
 * Patch app's public/index.html
 */
const publicIndexHtmlPath = resolve(dir, `${reactAppPath}/public/index.html`);
const publicIndexHtmlSource = readFileSync(publicIndexHtmlPath);
const publicIndexIndexPatched = await patchIndexHtml(publicIndexHtmlSource, homepage);
writeFileSync(publicIndexHtmlPath, publicIndexIndexPatched);

/**
 * Patch app's build/index.html
 */
const buildIndexHtmlPath = resolve(dir, `${reactAppPath}/build/index.html`);
access(buildIndexHtmlPath, constants.W_OK, async (err) => {
  if (err) return;
  const buildIndexHtmlSource = readFileSync(buildIndexHtmlPath);
  const buildIndexIndexPatched = await patchIndexHtml(buildIndexHtmlSource, homepage === "%PUBLIC_URL%" ? "" : homepage);
  writeFileSync(buildIndexHtmlPath, buildIndexIndexPatched);
});
