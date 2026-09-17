import fs from "node:fs/promises";
import path from "node:path";

const dataDirectory = process.env.LIKES_DIR ?? path.join(process.cwd(), "data");
const likesFile = path.join(dataDirectory, "likes.json");

export type LikeCounts = Record<string, number>;

let writeQueue: Promise<unknown> = Promise.resolve();

async function readCounts(): Promise<LikeCounts> {
  try {
    return JSON.parse(await fs.readFile(likesFile, "utf8")) as LikeCounts;
  } catch {
    return {};
  }
}

export async function getLikeCounts(): Promise<LikeCounts> {
  return readCounts();
}

export function addLike(slug: string): Promise<number> {
  const pending = writeQueue.then(async () => {
    const counts = await readCounts();
    const count = (counts[slug] ?? 0) + 1;
    const updated = { ...counts, [slug]: count };
    await fs.mkdir(dataDirectory, { recursive: true });
    const temporaryFile = `${likesFile}.${process.pid}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(updated, null, 2));
    await fs.rename(temporaryFile, likesFile);
    return count;
  });
  writeQueue = pending.catch(() => undefined);
  return pending;
}
