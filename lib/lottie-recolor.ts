// Deep-clones a Lottie/Bodymovin JSON and replaces every static fill/stroke
// color with the given RGB (each 0-1, matching Lottie's own color format).
function walk(node: any, rgb: [number, number, number]) {
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, rgb));
    return;
  }
  if (node && typeof node === "object") {
    if ((node.ty === "fl" || node.ty === "st") && node.c && node.c.a === 0 && Array.isArray(node.c.k)) {
      const alpha = node.c.k.length > 3 ? [node.c.k[3]] : [];
      node.c.k = [...rgb, ...alpha];
    }
    Object.values(node).forEach((v) => walk(v, rgb));
  }
}

export function recolorLottie(data: any, rgb: [number, number, number]) {
  const clone = JSON.parse(JSON.stringify(data));
  walk(clone, rgb);
  return clone;
}
