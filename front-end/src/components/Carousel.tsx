import React, {
  useEffect,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { arrow, closeBtn, trash } from '../../assets';
import { image } from '@tensorflow/tfjs';

const Carousel = ({
  images,
  setImages,
  setIsGalleryOpen,
}: {
  images: string[];
  setImages: Dispatch<SetStateAction<string[]>>;
  setIsGalleryOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [rightPos, setRightPos] = useState<number>(0);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const w = 640;

  const next = (idx: number) => {
    if (idx > images.length - 1) {
      idx = 0;
    }
    setRightPos(idx * w);
    setCurrIdx(idx);
  };

  const prev = (idx: number) => {
    if (idx < 0) {
      idx = images.length - 1;
    }
    setRightPos(idx * w);
    setCurrIdx(idx);
  };

  const closeCarousel = () => {
    setCurrIdx(0);
    setRightPos(0);
    setIsGalleryOpen(false);
  };

  const deleteImage = (idx: number) => {
    setImages((prev) => {
      const newArr = [...prev];
      newArr.splice(idx, 1);
      if (idx === newArr.length) {
        next(0);
      }
      if (newArr.length === 0) {
        closeCarousel();
      }
      return newArr;
    });
  };

  return (
    <div className="absolute top-0 left-0 h-screen w-full border flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[640px] h-[640px] border border-red-500 flex relative overflow-hidden">
        <button
          onClick={closeCarousel}
          className="z-50 absolute top-[5%] right-[5%] transition-all duration-500 ease-out"
        >
          <img className="w-5" src={closeBtn} alt="close button"></img>
        </button>

        {images &&
          images.map((image, idx) => (
            <>
              {currIdx == idx && (
                <button
                  onClick={() => deleteImage(idx)}
                  className="z-50 absolute top-[5%] left-[5%] "
                >
                  <img className="w-5" src={trash} alt="close button"></img>
                </button>
              )}
              {images.length > 1 && currIdx == idx && (
                <div className="flex justify-between items-center w-[640px] h-[640px] absolute z-20">
                  <button
                    className="rotate-180 ml-5"
                    onClick={() => prev(idx - 1)}
                  >
                    <img className="w-5" src={arrow}></img>
                  </button>
                  <button className="mr-5" onClick={() => next(idx + 1)}>
                    <img className="w-5" src={arrow}></img>
                  </button>
                </div>
              )}
              <img
                className={`-translate-x-[${rightPos.toString()}px] transform transition-all w-[640px] h-[640px]`}
                style={{ transform: `translate(-${rightPos.toString()}px)` }}
                src={image}
                alt="detection image"
              ></img>
            </>
          ))}
      </div>
    </div>
  );
};

export default Carousel;
