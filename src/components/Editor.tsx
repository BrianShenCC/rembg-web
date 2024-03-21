import { useCallback, useEffect, useState } from "react";
import { loadImage, useImage } from "../utils";
import removeBg from "../utils/rembg";

interface EditorProps {
  file: File;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  const [image, isLoaded] = useImage(file);
  const [isProcessingLoading, setIsProcessingLoading] = useState(true);
  const [result, setResult] = useState<HTMLImageElement>();

  useEffect(() => {
    console.log("file", file);
    if (file) onRemoveBg();
  }, [file]);

  const onRemoveBg = useCallback(async () => {
    setIsProcessingLoading(true);
    try {
      // 运行
      const start = Date.now();
      console.log("rembg_start");
      // each time based on the last result, the first is the original
      const newFile = file;
      const res = await removeBg(newFile);
      if (!res) {
        throw new Error("empty response");
      }
      // TODO: fix the render if it failed loading
      const newRender = new Image();
      newRender.dataset.id = Date.now().toString();
      await loadImage(newRender, res);

      console.log("rembg_processed", {
        duration: Date.now() - start,
      });
      setResult(newRender);
    } catch (error) {
      console.error("rembg", error);
    } finally {
      setIsProcessingLoading(false);
    }
  }, [file]);

  return (
    <div className="flex flex-col gap-10">
      <div className="min-h-40">
        <h2 className="text-center text-2xl">Original Image</h2>
        <div className="my-4 flex items-center justify-around">
          {isLoaded && <img src={image.src} alt="original" className="h-40" />}
        </div>
      </div>

      <div className="min-h-40 relative">
        {isProcessingLoading && (
          <div className="z-10 bg-white absolute bg-opacity-80 top-0 left-0 right-0 bottom-0  h-full w-full flex justify-center items-center">
            <div className="text-xl space-y-5 w-4/5 sm:w-1/2">
              <p>It is being processed, please be patient...</p>
            </div>
          </div>
        )}
        {!!result && (
          <>
            <h2 className="text-center text-2xl">Generated Image</h2>
            <div className="my-4 flex items-center justify-around">
              {isLoaded && <img src={result?.src} alt="original" className="h-40" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Editor;
