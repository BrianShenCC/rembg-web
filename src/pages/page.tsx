import { useState } from "react";
import Carousel from "../components/Carousel";
import Editor from "../components/Editor";
import FileSelect from "../components/FileSelect";
import { resizeImageFile } from "../utils";

export default function Home() {
  const [file, setFile] = useState<File>();

  async function selectImage(img: string) {
    const imgBlob = await fetch(`/public/examples/${img}.jpeg`).then((r) => r.blob());
    setFile(new File([imgBlob], `${img}.jpeg`, { type: "image/jpeg" }));
  }

  return (
    <main>
      {file ? (
        <Editor file={file}></Editor>
      ) : (
        <>
          <div className="h-72 sm:w-1/2 max-w-5xl mx-auto">
            <FileSelect
              onSelection={async (f) => {
                const { file: resizedFile } = await resizeImageFile(f, 1024 * 4);
                setFile(resizedFile);
              }}
            />
          </div>
          <Carousel selectImage={selectImage} />
        </>
      )}
    </main>
  );
}
