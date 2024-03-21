import { RawImage } from "@xenova/transformers";
import { loadModel, loadProcessor } from ".";

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
    img.src = url;
  });
}

function imageToBlob(imageElement: HTMLImageElement): Promise<Blob> {
  // Create an empty canvas element
  const canvas = document.createElement("canvas");
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;

  // Draw image onto the canvas
  const ctx = canvas.getContext("2d");
  ctx!.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
  return new Promise((resolve) => {
    canvas.toBlob(function (blob) {
      resolve(blob!);
    });
  });
}

/**
 * remove background of a image, return a base64 image
 *
 * @export
 * @param {(File | HTMLImageElement)} imageFile
 * @return {*}  {Promise<string>}
 */
export default async function removeBg(imageFile: File | HTMLImageElement): Promise<string> {
  const img = imageFile instanceof HTMLImageElement ? imageFile : await loadImage(URL.createObjectURL(imageFile));
  const imgBlob = await imageToBlob(img);
  const image = await RawImage.fromBlob(imgBlob);

  // Preprocess image

  console.debug("start load processor", new Date());
  const processor = await loadProcessor();
  console.debug("end load processor", new Date());
  const { pixel_values } = await processor(image);

  console.debug("start load model", new Date());
  // Predict alpha matte
  const model = await loadModel();
  console.debug("end load model", new Date());
  console.log(img.width, img.height);
  const { output } = await model({ input: pixel_values });

  // Resize mask back to original size
  const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(img.width, img.height);

  // Create new canvas
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d")!;

  // Draw original image output to canvas
  ctx.drawImage(image.toCanvas(), 0, 0);

  // Update alpha channel
  const pixelData = ctx.getImageData(0, 0, img.width, img.height);
  for (let i = 0; i < mask.data.length; ++i) {
    pixelData.data[4 * i + 3] = mask.data[i];
  }
  ctx.putImageData(pixelData, 0, 0);
  return canvas.toDataURL();
}
