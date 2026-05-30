import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const API_BASE = "https://api.kie.ai";
const DEFAULT_OUT_DIR = "public/images/generated";
const DEFAULT_MODEL = "nano-banana-pro";

function usage() {
  console.log(`Usage:
  node scripts/kie-nano-banana-pro.mjs --prompt "..." [options]
  node scripts/kie-nano-banana-pro.mjs --prompt-file prompt.txt [options]

Options:
  --out <path>             Final optimized image path. Default: public/images/generated/nano-banana-pro-<timestamp>.webp
  --out-dir <path>         Output directory when --out is omitted. Default: ${DEFAULT_OUT_DIR}
  --aspect-ratio <ratio>   KIE aspect_ratio. Default: 16:9
  --resolution <value>     KIE resolution. Default: 2K
  --format <png|jpg|webp>  KIE output_format. Default: png
  --original               Keep original downloaded image beside optimized output.
  --no-optimize            Skip local optimization and save provider result directly.
  --timeout <seconds>      Poll timeout. Default: 720
  --interval <seconds>     Poll interval. Default: 6
  --help                   Show this help.

Environment:
  Reads KIE_KEY from .env or process.env. Also accepts PowerShell form: $env:KIE_KEY="...".
`);
}

function parseArgs(argv) {
  const args = {
    aspectRatio: "16:9",
    resolution: "2K",
    format: "png",
    outDir: DEFAULT_OUT_DIR,
    keepOriginal: false,
    optimize: true,
    timeout: 720,
    interval: 6
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
      i += 1;
      return value;
    };

    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--prompt") args.prompt = next();
    else if (arg === "--prompt-file") args.promptFile = next();
    else if (arg === "--out") args.out = next();
    else if (arg === "--out-dir") args.outDir = next();
    else if (arg === "--aspect-ratio") args.aspectRatio = next();
    else if (arg === "--resolution") args.resolution = next();
    else if (arg === "--format") args.format = next();
    else if (arg === "--original") args.keepOriginal = true;
    else if (arg === "--no-optimize") args.optimize = false;
    else if (arg === "--timeout") args.timeout = Number(next());
    else if (arg === "--interval") args.interval = Number(next());
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function readDotEnvKey() {
  if (process.env.KIE_KEY) return process.env.KIE_KEY;
  if (!existsSync(".env")) return "";

  const lines = readFileSync(".env", "utf8").split(/\r?\n/);
  for (const line of lines) {
    let match = line.match(/^\s*KIE_KEY\s*=\s*(.+?)\s*$/);
    if (!match) match = line.match(/^\s*\$env:KIE_KEY\s*=\s*(.+?)\s*$/);
    if (match) return match[1].trim().replace(/^['"]|['"]$/g, "");
  }
  return "";
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function kieFetch(path, options, key) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`KIE returned non-JSON response (${response.status}): ${text.slice(0, 500)}`);
  }
  if (!response.ok || json.code !== 200) {
    const msg = json.msg || response.statusText;
    if (response.status === 401 || json.code === 401) {
      throw new Error(`KIE authentication failed: ${msg}`);
    }
    throw new Error(`KIE request failed (${json.code || response.status}): ${msg}`);
  }
  return json;
}

function inferExtension(contentType, fallback) {
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return ".jpg";
  if (contentType?.includes("png")) return ".png";
  return fallback.startsWith(".") ? fallback : `.${fallback}`;
}

async function download(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download result (${response.status}): ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  writeFileSync(path, bytes);
  return response.headers.get("content-type") || "";
}

function commandExists(command) {
  const result = spawnSync(command, ["--version"], { stdio: "ignore", shell: process.platform === "win32" });
  return result.status === 0;
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed`);
}

function optimizeWithSharp(input, output) {
  const code = `
    import sharp from "sharp";
    const input = ${JSON.stringify(input)};
    const output = ${JSON.stringify(output)};
    const image = sharp(input, { animated: false }).rotate();
    const ext = output.toLowerCase().split(".").pop();
    if (ext === "webp") await image.webp({ quality: 82, effort: 5 }).toFile(output);
    else if (ext === "jpg" || ext === "jpeg") await image.jpeg({ quality: 84, mozjpeg: true }).toFile(output);
    else await image.png({ compressionLevel: 9, palette: true }).toFile(output);
  `;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], { stdio: "inherit" });
  return result.status === 0;
}

function optimizeWithImageMagick(input, output) {
  if (!commandExists("magick")) return false;
  const ext = extname(output).toLowerCase();
  const args = [input, "-strip"];
  if (ext === ".webp") args.push("-quality", "82");
  if (ext === ".jpg" || ext === ".jpeg") args.push("-quality", "84");
  if (ext === ".png") args.push("-define", "png:compression-level=9");
  args.push(output);
  run("magick", args);
  return true;
}

function copyUnoptimized(input, output) {
  const data = readFileSync(input);
  writeFileSync(output, data);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const prompt = args.promptFile ? readFileSync(args.promptFile, "utf8").trim() : args.prompt;
  if (!prompt) throw new Error("Provide --prompt or --prompt-file.");

  const key = readDotEnvKey();
  if (!key) throw new Error("KIE_KEY not found. Add KIE_KEY=... to .env or set process.env.KIE_KEY.");

  mkdirSync(args.outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "Z");
  const finalOut = resolve(args.out || join(args.outDir, `nano-banana-pro-${stamp}.webp`));
  mkdirSync(dirname(finalOut), { recursive: true });

  const task = await kieFetch("/api/v1/jobs/createTask", {
    method: "POST",
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      input: {
        prompt,
        image_input: [],
        aspect_ratio: args.aspectRatio,
        resolution: args.resolution,
        output_format: args.format
      }
    })
  }, key);

  const taskId = task.data.taskId;
  console.log(`Created task: ${taskId}`);

  const deadline = Date.now() + args.timeout * 1000;
  let resultUrl = "";
  while (Date.now() < deadline) {
    await sleep(args.interval * 1000);
    const status = await kieFetch(`/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`, { method: "GET" }, key);
    const state = status.data.state;
    console.log(`State: ${state}`);
    if (state === "success") {
      const result = JSON.parse(status.data.resultJson || "{}");
      resultUrl = result.resultUrls?.[0] || result.resultUrl || result.url || "";
      break;
    }
    if (state === "fail") {
      throw new Error(`KIE task failed: ${status.data.failCode || ""} ${status.data.failMsg || ""}`.trim());
    }
  }

  if (!resultUrl) throw new Error(`Timed out waiting for task ${taskId}`);

  const originalExt = inferExtension("", args.format);
  const originalPath = resolve(args.outDir, `${basename(finalOut, extname(finalOut))}.original${originalExt}`);
  const contentType = await download(resultUrl, originalPath);
  const correctedOriginalPath = originalPath.replace(new RegExp(`${originalExt.replace(".", "\\.")}$`), inferExtension(contentType, args.format));
  if (correctedOriginalPath !== originalPath) {
    writeFileSync(correctedOriginalPath, readFileSync(originalPath));
    unlinkSync(originalPath);
  }

  if (args.optimize) {
    const sharpOk = optimizeWithSharp(correctedOriginalPath, finalOut);
    if (!sharpOk && !optimizeWithImageMagick(correctedOriginalPath, finalOut)) {
      console.warn("No optimizer available. Install sharp or ImageMagick for optimized output; copying original.");
      copyUnoptimized(correctedOriginalPath, finalOut);
    }
  } else {
    copyUnoptimized(correctedOriginalPath, finalOut);
  }

  if (args.keepOriginal && correctedOriginalPath !== finalOut) {
    console.log(`Original provider file: ${correctedOriginalPath}`);
  } else if (correctedOriginalPath !== finalOut && existsSync(correctedOriginalPath)) {
    unlinkSync(correctedOriginalPath);
  }
  console.log(`Final image: ${finalOut}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
