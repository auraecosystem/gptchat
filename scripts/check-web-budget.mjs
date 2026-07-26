import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const buildRoot = join(root, ".next", "static");

const limits = {
  totalJs: Number(process.env.TELLORIA_MAX_JS_BYTES ?? 20 * 1024 * 1024),
  largestJs: Number(process.env.TELLORIA_MAX_CHUNK_BYTES ?? 4 * 1024 * 1024),
  totalCss: Number(process.env.TELLORIA_MAX_CSS_BYTES ?? 1024 * 1024),
};

async function collect(directory, extension) {
  const files = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (
        entry.name.endsWith(extension) &&
        !entry.name.endsWith(".map")
      ) {
        const info = await stat(absolute);
        files.push({ path: relative(root, absolute), bytes: info.size });
      }
    }
  }
  await walk(directory);
  return files;
}

function format(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

let js;
let css;
try {
  [js, css] = await Promise.all([
    collect(join(buildRoot, "chunks"), ".js"),
    collect(join(buildRoot, "css"), ".css"),
  ]);
} catch {
  console.error(
    "Telloria Web budget: .next production output not found. Run npm run build first.",
  );
  process.exit(1);
}

const totalJs = js.reduce((sum, file) => sum + file.bytes, 0);
const totalCss = css.reduce((sum, file) => sum + file.bytes, 0);
const largestJs = [...js].sort((a, b) => b.bytes - a.bytes)[0];
const failures = [];

if (totalJs > limits.totalJs) {
  failures.push(
    `total JS ${format(totalJs)} exceeds ${format(limits.totalJs)}`,
  );
}
if (largestJs && largestJs.bytes > limits.largestJs) {
  failures.push(
    `largest JS chunk ${largestJs.path} is ${format(
      largestJs.bytes,
    )}; budget ${format(limits.largestJs)}`,
  );
}
if (totalCss > limits.totalCss) {
  failures.push(
    `total CSS ${format(totalCss)} exceeds ${format(limits.totalCss)}`,
  );
}

console.log(
  `Telloria Web budget: JS ${format(totalJs)}, largest ${
    largestJs ? format(largestJs.bytes) : "0 MiB"
  }, CSS ${format(totalCss)}.`,
);

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
