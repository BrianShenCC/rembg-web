import { FC } from "react";

interface CarouselProps {
  selectImage: (image: string) => void;
}

const Carousel: FC<CarouselProps> = ({ selectImage }) => {
  return (
    <div className="flex flex-col sm:flex-row pt-10 items-center justify-center cursor-pointer">
      <span className="text-gray-500">Try it</span>
      <div className="flex space-x-2 sm:space-x-4 px-4">
        {["dog", "car", "shoe"].map((image) => (
          <div
            key={image}
            onClick={() => selectImage(image)}
            role="button"
            onKeyDown={() => selectImage(image)}
            tabIndex={-1}
          >
            <img
              className="rounded-md hover:opacity-75 w-auto h-25"
              src={`examples/${image}.jpeg`}
              alt={image}
              style={{ height: "100px" }}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
