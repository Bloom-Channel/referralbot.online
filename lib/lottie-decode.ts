import { inflate } from "pako";

// .tgs files (Telegram's animated sticker format) are gzip-compressed
// Lottie/Bodymovin JSON. Plain .json Lottie exports aren't compressed.
// Both are handled here by checking the gzip magic bytes.
function bytesToLottieJson(bytes: Uint8Array): any {
  const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
  const jsonStr = isGzip ? inflate(bytes, { to: "string" }) : new TextDecoder().decode(bytes);
  return JSON.parse(jsonStr);
}

export async function decodeLottieFile(file: File): Promise<any> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  return bytesToLottieJson(bytes);
}

export async function decodeLottieUrl(url: string): Promise<any> {
  const res = await fetch(url);
  const bytes = new Uint8Array(await res.arrayBuffer());
  return bytesToLottieJson(bytes);
}
