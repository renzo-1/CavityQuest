import React, {
  useEffect,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
  ChangeEvent,
} from 'react';
import { arrow, closeBtn, trash } from '../../assets';
import { Capture } from 'utils/Interfaces';
import { toothNames, toothLocations } from 'data/teeth';
import { useForm } from 'react-hook-form';

const Carousel = ({
  images,
  setImages,
  setIsGalleryOpen,
}: {
  images: Capture[];
  setImages: Dispatch<SetStateAction<Capture[]>>;
  setIsGalleryOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<Capture>({
    defaultValues: {
      name: toothNames[0],
      location: toothLocations[0],
    },
  });

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
  const handleInputChanges = (
    event: ChangeEvent<HTMLSelectElement>,
    image: Capture,
    index: number
  ) => {
    const { value, name } = event.target;
    const newName = name as 'url' | 'location' | 'name';
    setImages((prev) => {
      const newArray = [...prev];
      const indexToEdit = newArray.findIndex((img) => img.url === image.url);
      newArray[indexToEdit] = { ...newArray[indexToEdit], [newName]: value };
      console.log('newarray', newArray);
      return newArray;
    });

    setValue(newName, value);
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
                <>
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
                  <form className="absolute bottom-0 z-20 flex pl-5 pb-5 space-x-5">
                    <select
                      name="name"
                      className="border border-gray-400"
                      defaultValue={image.name}
                      {...(register('name'),
                      {
                        required: true,
                        onChange: (e) => handleInputChanges(e, image, idx),
                      })}
                      aria-invalid={errors.name ? 'true' : 'false'}
                    >
                      <option hidden>Name...</option>
                      {toothNames.map((toothName) => (
                        <option value={toothName}>{toothName}</option>
                      ))}
                    </select>
                    <select
                      name="location"
                      className="border border-gray-400"
                      defaultValue={image.location}
                      {...(register('location'),
                      {
                        required: true,
                        onChange: (e) => handleInputChanges(e, image, idx),
                      })}
                      aria-invalid={errors.location ? 'true' : 'false'}
                    >
                      <option hidden>Location...</option>
                      {toothLocations.map((treatment) => (
                        <option value={treatment}>{treatment}</option>
                      ))}
                    </select>
                  </form>
                </>
              )}

              <img
                className={`-translate-x-[${rightPos.toString()}px] transform transition-all w-[640px] h-[640px]`}
                style={{ transform: `translate(-${rightPos.toString()}px)` }}
                src={image.url}
                alt="detection image"
              ></img>
            </>
          ))}
      </div>
    </div>
  );
};

export default Carousel;
