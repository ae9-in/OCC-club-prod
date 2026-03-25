import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "./env";
import { HttpError } from "../lib/httpError";

const requestedUploadDir = path.resolve(process.cwd(), env.uploadDir);
const fallbackUploadDir = path.resolve(process.cwd(), "./uploads");

function ensureWritableUploadDir(targetDir: string) {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.accessSync(targetDir, fs.constants.W_OK);
  return targetDir;
}

function resolveUploadDir() {
  try {
    return ensureWritableUploadDir(requestedUploadDir);
  } catch (error) {
    if (requestedUploadDir !== fallbackUploadDir) {
      console.warn(
        `Upload directory "${requestedUploadDir}" is not writable. Falling back to "${fallbackUploadDir}".`,
        error
      );
      return ensureWritableUploadDir(fallbackUploadDir);
    }

    throw error;
  }
}

const uploadDir = resolveUploadDir();

const allowedMimeToExt = new Map<string, string>([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/jpg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"]
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = allowedMimeToExt.get(file.mimetype) || path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "").slice(0, 40) || "file";
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExt = path.extname(file.originalname).toLowerCase();
    const expectedExt = allowedMimeToExt.get(file.mimetype);

    if (!expectedExt || !allowedMimeToExt.has(file.mimetype) || (allowedExt && allowedExt !== expectedExt)) {
      cb(new HttpError(400, "Only PNG, JPG, JPEG, WEBP, and GIF uploads are supported"));
      return;
    }
    cb(null, true);
  }
});

function isSingleMulterFile(
  value: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>
): value is Express.Multer.File {
  return typeof (value as Express.Multer.File).path === "string";
}

function matchesSignature(signature: number[], bytes: Buffer) {
  return signature.every((value, index) => bytes[index] === value);
}

function isSupportedImageBuffer(bytes: Buffer) {
  const png = [0x89, 0x50, 0x4e, 0x47];
  const jpeg = [0xff, 0xd8, 0xff];
  const gif87a = Buffer.from("474946383761", "hex");
  const gif89a = Buffer.from("474946383961", "hex");
  const riff = Buffer.from("52494646", "hex");
  const webp = Buffer.from("57454250", "hex");

  if (matchesSignature(png, bytes) || matchesSignature(jpeg, bytes)) {
    return true;
  }

  if (bytes.subarray(0, 6).equals(gif87a) || bytes.subarray(0, 6).equals(gif89a)) {
    return true;
  }

  if (bytes.subarray(0, 4).equals(riff) && bytes.subarray(8, 12).equals(webp)) {
    return true;
  }

  return false;
}

async function validateUploadedFile(file?: Express.Multer.File) {
  if (!file) {
    return;
  }

  const handle = await fs.promises.open(file.path, "r");
  try {
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, buffer.length, 0);
    if (!isSupportedImageBuffer(buffer)) {
      throw new HttpError(400, "Uploaded file content is not a supported image");
    }
  } catch (error) {
    await fs.promises.unlink(file.path).catch(() => undefined);
    throw error;
  } finally {
    await handle.close();
  }
}

export async function assertSafeUploadedFiles(
  files: Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]> | undefined
) {
  if (!files) {
    return;
  }

  if (Array.isArray(files)) {
    for (const file of files) {
      await validateUploadedFile(file);
    }
    return;
  }

  if (isSingleMulterFile(files)) {
    await validateUploadedFile(files);
    return;
  }

  for (const entry of Object.values(files)) {
    for (const file of entry) {
      await validateUploadedFile(file);
    }
  }
}

export { uploadDir };
