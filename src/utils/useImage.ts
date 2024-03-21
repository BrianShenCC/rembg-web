import { useEffect, useState } from "react";

export function useImage(file: Blob | MediaSource): [HTMLImageElement, boolean] {
  const [image, setImage] = useState(new Image());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const newImage = new Image();
    newImage.onload = () => {
      setIsLoaded(true);
    };
    newImage.src = URL.createObjectURL(file);
    setImage(newImage);

    return () => {
      newImage.onload = null;
    };
  }, [file]);

  return [image, isLoaded];
}
