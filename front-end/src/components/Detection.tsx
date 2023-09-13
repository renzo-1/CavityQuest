import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  Dispatch,
  SetStateAction,
} from 'react';
import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-backend-webgl'; // set backend to webgl
import Loader from './Loader';
import { WebcamOps } from '../utils/webcam';
// import Webcam from 'react-webcam';

import { renderBoxes } from '../utils/renderBox';
import { non_max_suppression } from '../utils/nonMaxSuppression';
// import '../styles/App.css';
import { BackButton } from 'components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'features/AppContext';
import { ContextType } from 'utils/Interfaces';

function shortenedCol(arrayofarray: any, indexlist: any) {
  return arrayofarray.map(function (array: number[]) {
    return indexlist.map(function (idx: number) {
      return array[idx];
    });
  });
}

const Detection = ({
  handleSubmit,
  videoRef,
  captures,
  setCaptures,
  setIsGalleryOpen,
  webcamOps,
}: {
  handleSubmit: () => void;
  videoRef: RefObject<HTMLVideoElement>;
  captures: string[];
  setCaptures: Dispatch<SetStateAction<string[]>>;
  setIsGalleryOpen: Dispatch<SetStateAction<boolean>>;
  webcamOps: WebcamOps;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({ loading: true, progress: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string>();
  const model_dim: [number, number] = [640, 640];
  const { currPatient, currClinic } = useAppContext() as ContextType;
  const w = 640;
  const h = 640;

  // configs
  const modelName = 'Cavity Detection';
  const threshold = 0.3;
  /**
   * Function to detect every frame loaded from webcam in video tag.
   * @param {tf.GraphModel} model loaded YOLOv7 tensorflow.js model
   */

  const detectFrame = async (model: tf.GraphModel) => {
    try {
      tf.engine().startScope();
      const input = tf.tidy(() => {
        if (videoRef.current) {
          const img = tf.image
            .resizeBilinear(tf.browser.fromPixels(videoRef.current), model_dim)
            .div(255.0)
            .transpose([2, 0, 1])
            .expandDims(0);
          return img;
        }
      });
      if (input) {
        await model.executeAsync(input).then((res: any) => {
          res = res.arraySync()[0];
          var detections = non_max_suppression(res);
          const boxes = shortenedCol(detections, [0, 1, 2, 3]);
          const scores = shortenedCol(detections, [4]);
          const class_detect = shortenedCol(detections, [5]);
          if (
            //check if the parameters are 2d
            canvasRef &&
            boxes[0] !== Array &&
            scores[0] !== Array &&
            class_detect[0] !== Array
          ) {
            renderBoxes(canvasRef, threshold, boxes, scores, class_detect);
          }
          tf.dispose(res);
        });
      }
      requestAnimationFrame(() => detectFrame(model)); // get another frame
      tf.engine().endScope();
    } catch (e) {
      console.log('Detection Error', e);
    }
  };

  const capture = () => {
    const mainCanvas = canvasRef.current!;

    if (!mainCanvas) return;
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
    }, 10);
    const w = mainCanvas.width;
    const h = mainCanvas.height;

    const mainCtx = mainCanvas.getContext('2d') as CanvasRenderingContext2D;

    // create a copy of the canvas
    const boxCanvas = document.createElement('canvas');
    boxCanvas.height = 640;
    boxCanvas.width = 640;

    const boxCtx = boxCanvas.getContext('2d') as CanvasRenderingContext2D;

    boxCtx.drawImage(mainCanvas, 0, 0);
    // draw the current frame
    mainCtx.drawImage(videoRef.current!, 0, 0, w, h);

    // draw bounding boxes
    mainCtx.drawImage(boxCtx.canvas, 0, 0, w, h);

    const imageUrl = mainCanvas.toDataURL('image/jpeg', 1);

    setScreenshotUrl(mainCanvas.toDataURL('image/jpeg', 1));

    setCaptures((prev) => [imageUrl, ...prev]);

    boxCtx.clearRect(0, 0, w, h);
    mainCtx.clearRect(0, 0, w, h);
  };

  useEffect(() => {
    const mainCanvas = canvasRef.current!;
    mainCanvas.width = 640;
    mainCanvas.height = 640;

    tf.loadGraphModel(`models/model.json`, {
      onProgress: (fractions) => {
        setLoading({ loading: true, progress: fractions });
      },
    })
      .then(async (yolov7) => {
        // Warmup the model before using real data.

        if (yolov7.inputs[0].shape) {
          const dummyInput = tf.ones(yolov7.inputs[0].shape);
          const warmupResult = await yolov7.execute(dummyInput);
          tf.dispose(warmupResult);
          tf.dispose(dummyInput);
          setLoading({ loading: false, progress: 1 });
          webcamOps.open(videoRef, () => detectFrame(yolov7));
        }
      })
      .catch((e) => {});
  }, []);
  console.warn = () => {};

  window.addEventListener('keydown', (event) => {
    if (event.code == 'Space') capture();
  });
  const handleCloseCam = () => {
    webcamOps.close(videoRef);
    setCaptures([]);
  };
  return (
    <>
      <div className="flex z-30 w-full justify-between">
        <div onClick={handleCloseCam}>
          <BackButton />
        </div>
        <div>
          <button
            onClick={() => navigate(`/${currClinic?.id}/records/`)}
            className="font-bold text-xl px-4 py-2 "
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary font-bold text-white text-xl px-4 py-2 rounded-lg shadow-md transition-all duration-500 ease-out"
          >
            Done
          </button>
        </div>
      </div>

      <div className="space-y-10 flex justify-center items-center flex-col">
        {loading.loading ? (
          <>
            <Loader>
              Loading model... {(loading.progress * 100).toFixed(2)}%
            </Loader>
          </>
        ) : (
          <p> </p>
        )}
        <div className={`relative flex justify-center bg-gray-500`}>
          <div className={`min-h-fit min-w-fit`}>
            {isCapturing && (
              <div className="w-full h-full bg-white opacity-80 absolute top-0 left-0 "></div>
            )}
            <video
              className={`max-h-[${h}px]  max-w-[${w}px]`}
              autoPlay
              playsInline
              muted
              ref={videoRef}
              id="frame"
            />
            <canvas
              className="absolute top-0 left-0 w-full h-full"
              ref={canvasRef}
            />
            <canvas className="absolute top-0 left-0" ref={boxRef} />
          </div>
        </div>

        <div className="w-full relative  flex justify-center space-x-10">
          <button
            onClick={capture}
            className="border-2 border-dashed font-bold border-gray-400 text-black text-2xl px-4 py-2 rounded-xl"
          >
            Capture
          </button>

          <div
            className="w-[100px] h-[60px] border rounded-xl border-gray-200 overflow-hidden cursor-pointer"
            onClick={() => setIsGalleryOpen(true)}
          >
            {captures[0] && (
              <img
                src={captures[0]}
                className="object-cover  cursor-pointer"
              ></img>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Detection;
