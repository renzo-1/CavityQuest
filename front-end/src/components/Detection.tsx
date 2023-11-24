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
import { HeaderButtons } from 'components';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'features/AppContext';


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
  captures: Capture[];
  setCaptures: Dispatch<SetStateAction<Capture[]>>;
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
  const liveDetection = useRef<boolean>(true);

  const w = 640;
  const h = 640;

  // configs
  const modelName = 'Cavity Detection';
  const threshold = 0.45;

  const detectFrame = async (model: tf.GraphModel) => {
    if (!liveDetection.current) return;
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
      const startTime = new Date().getTime();

      if (input) {
        await model.executeAsync(input).then((res: any) => {
          console.log(
            'inference time:',
            new Date().getTime() - startTime,
            'ms'
          );

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
    } catch (e) {
      console.log('Detection Error', e);
    }
    tf.engine().endScope();
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
    boxCanvas.height = h;
    boxCanvas.width = w;

    const boxCtx = boxCanvas.getContext('2d') as CanvasRenderingContext2D;

    boxCtx.drawImage(mainCanvas, 0, 0);
    // draw the current frame
    mainCtx.drawImage(videoRef.current!, 0, 0, w, h);

    // draw bounding boxes
    mainCtx.drawImage(boxCtx.canvas, 0, 0, w, h);

    const imageUrl = mainCanvas.toDataURL('image/jpeg', 1);

    setScreenshotUrl(mainCanvas.toDataURL('image/jpeg', 1));

    setCaptures((prev) => [{ url: imageUrl, location: '', name: '' }, ...prev]);

    boxCtx.clearRect(0, 0, w, h);
    mainCtx.clearRect(0, 0, w, h);
  };

  useEffect(() => {
    if (!liveDetection.current) return;
    const mainCanvas = canvasRef.current!;
    mainCanvas.width = w;
    mainCanvas.height = h;

    tf.loadGraphModel(`models/model.json`, {
      onProgress: (fractions) => {
        setLoading({ loading: true, progress: fractions });
      },
    })
      .then(async (yolov7) => {
        // Warmup the model before using real data.

        if (yolov7.inputs[0].shape && videoRef) {
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
  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      if (event.code == 'Space') capture();
    });
  }, []);

  const handleCloseCam = () => {
    console.log('closed');
    webcamOps.close(videoRef);
    liveDetection.current = false;
    setCaptures([]);
  };

  return (
    <>
      <div className="flex z-30 w-full justify-between">
        <div onClick={handleCloseCam}>
          <HeaderButtons home={false} records={false} auditTrails={false} />
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
            className="absolute top-0 left-0 w-full h-full mainCanvas"
            ref={canvasRef}
          />
          <canvas className="absolute top-0 left-0 boxCanvas" ref={boxRef} />
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
                src={captures[0].url}
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
