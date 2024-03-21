// https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
interface ResizeImageFileResult {
  file: File;
  resized: boolean;
  originalWidth?: number;
  originalHeight?: number;
}
export function resizeImageFile(file: File, maxSize: number): Promise<ResizeImageFileResult> {
  const reader = new FileReader();
  const image = new Image();
  const canvas = document.createElement("canvas");

  const resize = (): ResizeImageFileResult => {
    let { width, height } = image;

    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else if (height > maxSize) {
      width *= maxSize / height;
      height = maxSize;
    }

    if (width === image.width && height === image.height) {
      return { file, resized: false };
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("could not get context");
    }
    canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    const blob = dataURItoBlob(dataUrl);
    const f = new File([blob], file.name, {
      type: file.type,
    });
    return {
      file: f,
      resized: true,
      originalWidth: image.width,
      originalHeight: image.height,
    };
  };

  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject(new Error("Not an image"));
      return;
    }
    reader.onload = (readerEvent: any) => {
      image.onload = () => resolve(resize());
      image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function dataURItoBlob(dataURI: string) {
  const mime = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i += 1) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: mime });
}
