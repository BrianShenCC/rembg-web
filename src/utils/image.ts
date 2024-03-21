export function loadImage(image: HTMLImageElement, src: string) {
  return new Promise((resolve, reject) => {
    const initSRC = image.src;
    const img = image;
    img.onload = resolve;
    img.onerror = (err) => {
      img.src = initSRC;
      reject(err);
    };
    img.src = src;
  });
}
