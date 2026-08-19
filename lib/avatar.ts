import { decodeLottieFile } from "./lottie-decode";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];
const LOTTIE_EXTENSIONS = [".tgs", ".json"];

export function isVideoAvatar(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

export function isLottieAvatar(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return LOTTIE_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

export function isLottieFile(file: File) {
  const name = file.name.toLowerCase();
  return LOTTIE_EXTENSIONS.some((ext) => name.endsWith(ext));
}

const MAX_MEDIA_SECONDS = 1.5;

// Videos have to be short since they're used as tiny looping avatars —
// this checks duration client-side before upload so people don't waste
// a round trip on a clip that's way too long.
export function checkVideoDuration(file: File): Promise<{ ok: true } | { ok: false; message: string }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      if (video.duration > MAX_MEDIA_SECONDS) {
        resolve({ ok: false, message: `Video must be ${MAX_MEDIA_SECONDS} seconds or shorter.` });
      } else {
        resolve({ ok: true });
      }
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      resolve({ ok: false, message: "Couldn't read that video file." });
    };
    video.src = URL.createObjectURL(file);
  });
}

// Same idea for TGS/Lottie stickers, using the animation's own frame
// rate and in/out points instead of a <video> element's metadata.
export async function checkLottieDuration(file: File): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const data = await decodeLottieFile(file);
    const duration = (data.op - data.ip) / data.fr;
    if (duration > MAX_MEDIA_SECONDS) {
      return { ok: false, message: `Sticker must be ${MAX_MEDIA_SECONDS} seconds or shorter.` };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Couldn't read that sticker file." };
  }
}
