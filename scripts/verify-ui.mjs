import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const baseUrl = process.env.TRIBUTE_URL ?? "http://127.0.0.1:7777";
const outDir = "tmp-ui-checks";

mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 }
];

const samplePoints = [
  { label: "opening", wait: 1400 },
  { label: "message", wait: 7200 },
  { label: "virtues", wait: 14600 },
  { label: "tribute", wait: 26000 },
  { label: "portrait", wait: 40500 },
  { label: "gallery", wait: 46200 },
  { label: "slot", wait: 54800 },
  { label: "ending", wait: 62200 }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectLayoutState(page) {
  return page.evaluate(() => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const visibleEnough = (node) => {
      let current = node;
      let opacity = 1;
      while (current && current.nodeType === 1) {
        const style = getComputedStyle(current);
        if (style.visibility === "hidden" || style.display === "none") return false;
        opacity *= Number.parseFloat(style.opacity || "1");
        current = current.parentElement;
      }
      return opacity > 0.08;
    };
    const stages = [...document.querySelectorAll(".stage")].map((stage) => {
      const style = getComputedStyle(stage);
      return {
        className: stage.className,
        opacity: Number.parseFloat(style.opacity || "0"),
        visibility: style.visibility
      };
    });
    const visibleStages = stages.filter((stage) => stage.visibility !== "hidden" && stage.opacity > 0.08);
    const visibleContent = [...document.querySelectorAll("h1, h2, p, img, figure, .slot-machine")]
      .filter((node) => {
        if (!visibleEnough(node)) return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
    const overflowing = [...document.querySelectorAll("h1, h2, p, button, img, figure, .slot-machine")]
      .filter((node) => {
        if (!visibleEnough(node)) return false;
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return rect.left < -2 || rect.top < -2 || rect.right > viewport.width + 2 || rect.bottom > viewport.height + 2;
      })
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName.toLowerCase(),
          className: node.className,
          text: node.textContent?.trim().slice(0, 60),
          rect: {
            left: Math.round(rect.left),
            top: Math.round(rect.top),
            right: Math.round(rect.right),
            bottom: Math.round(rect.bottom)
          }
        };
      });
    return {
      viewport,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      visibleStageCount: visibleStages.length,
      visibleContentCount: visibleContent.length,
      visibleStages,
      overflowing
    };
  });
}

const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outDir}/${viewport.name}-start.png`, fullPage: false });

  const play = page.getByRole("button", { name: /^play$/i });
  await play.click();

  let elapsed = 0;
  for (const sample of samplePoints) {
    await sleep(sample.wait - elapsed);
    elapsed = sample.wait;
    await page.screenshot({ path: `${outDir}/${viewport.name}-${sample.label}.png`, fullPage: false });
    const state = await collectLayoutState(page);
    if (state.scrollWidth > viewport.width + 2) {
      failures.push(`${viewport.name}/${sample.label}: horizontal overflow ${state.scrollWidth}px > ${viewport.width}px`);
    }
    if (state.visibleStageCount !== 1) {
      failures.push(`${viewport.name}/${sample.label}: ${state.visibleStageCount} visible stages`);
    }
    if (state.visibleContentCount < 1) {
      failures.push(`${viewport.name}/${sample.label}: no visible content`);
    }
    if (state.overflowing.length > 0) {
      failures.push(`${viewport.name}/${sample.label}: overflowing ${JSON.stringify(state.overflowing.slice(0, 2))}`);
    }
  }

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`UI verification passed. Screenshots written to ${outDir}`);
