import fs from "node:fs";
import path from "node:path";

/** A local article photograph. Only files under public/images/ are allowed. */
const SAFE_SRC = /^\/images\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)$/;

export type IntrinsicSize = { width: number; height: number };

/**
 * Pixel size of a JPEG, PNG, or WebP file. Article figures use this so the
 * width and height on the page are the file's, not a guessed social crop.
 */
export function readIntrinsicSize(filePath: string): IntrinsicSize {
  const buf = fs.readFileSync(filePath);
  const size = sizeFromBuffer(buf);
  if (!size || size.width < 1 || size.height < 1) {
    throw new Error(`Could not read intrinsic dimensions: ${filePath}`);
  }
  return size;
}

export function resolvePublicImage(src: string): { filePath: string; size: IntrinsicSize } {
  if (!SAFE_SRC.test(src) || src.includes("..")) {
    throw new Error(`figure src must be a file under /images/: ${src}`);
  }
  const publicDir = path.resolve(process.cwd(), "public");
  const filePath = path.resolve(publicDir, src.slice(1));
  if (filePath !== publicDir && !filePath.startsWith(publicDir + path.sep)) {
    throw new Error(`figure src escapes public/: ${src}`);
  }
  let stat: fs.Stats;
  try {
    stat = fs.lstatSync(filePath);
  } catch {
    throw new Error(`figure src is missing from public/: ${src}`);
  }
  if (stat.isSymbolicLink() || !stat.isFile()) {
    throw new Error(`figure src is not a real file: ${src}`);
  }
  return { filePath, size: readIntrinsicSize(filePath) };
}

function sizeFromBuffer(buf: Buffer): IntrinsicSize | null {
  if (buf.length >= 24 && buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    return jpegSize(buf);
  }
  if (buf.length >= 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return webpSize(buf);
  }
  return null;
}

function jpegSize(buf: Buffer): IntrinsicSize | null {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    // Standalone markers and padding.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) break;
    const seglen = buf.readUInt16BE(i + 2);
    // SOF0–SOF3, SOF5–SOF7, SOF9–SOF11, SOF13–SOF15. Skip DHT (C4), JPG (C8), DAC (CC).
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    i += 2 + seglen;
  }
  return null;
}

function webpSize(buf: Buffer): IntrinsicSize | null {
  const format = buf.toString("ascii", 12, 16);
  if (format === "VP8X" && buf.length >= 30) {
    return {
      width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
      height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
    };
  }
  if (format === "VP8 " && buf.length >= 30) {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (format === "VP8L" && buf.length >= 25) {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}
