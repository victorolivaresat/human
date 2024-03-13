import React, { useState, useEffect, useRef } from "react";
import JsonView from "@uiw/react-json-view";
import { Human } from "@vladmandic/human";
import Akira from "./assets/akira.jpg";
import { darkTheme } from "@uiw/react-json-view/dark";
import "./App.css";

function App() {
  const [human, setHuman] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const jsonRef = useRef(null);

  const [resultData, setResultData] = useState({
    faceCount: { status: false, val: 0, text: "Face count" },
    faceConfidence: { status: false, val: 0, text: "Face confidence" },
    faceSize: { status: false, val: 0, text: "Face size" },
    antispoof: { status: false, val: 0, text: "Antispoof" },
    liveness: { status: false, val: 0, text: "Liveness" },
    distance: { status: false, val: 0, text: "Distance" },
    age: { status: false, val: 0, text: "Age" },
    gender: { status: false, val: 0, text: "Gender" },
    gesture: { status: false, val: 0, text: "Gesture" },
  });

  useEffect(() => {
    const humanConfig = {
      face: {
        enabled: true,
        detector: { rotation: true, return: true },
        mesh: { enabled: true },
        description: { enabled: true },
        antispoof: { enabled: true },
        liveness: { enabled: true },
      },
      body: { enabled: false },
      hand: { enabled: false },
      gesture: { enabled: true },
    };

    const humanInstance = new Human(humanConfig);
    setHuman(humanInstance);

    return () => {
      humanInstance.sleep();
    };
  }, []);

  const startDetection = async () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;

    canvas.width = image.width;
    canvas.height = image.height;

    const result = await human.detect(image);
    human.draw.all(canvas, result);

    console.log(result);

    resultData.faceCount.val = human.result.face.length;
    resultData.faceCount.status = resultData.faceCount.val === 1;

    if (resultData.faceCount.status) {
      const face = human.result.face[0];
      setResultData((prevState) => ({
        ...prevState,
        faceConfidence: { val: face.faceScore },
        antispoof: { val: face.real },
        liveness: { val: face.live },
        faceSize: { val: face.box[2] },
        distance: { val: face.distance },
        age: { val: face.age },
        gender: { val: face.genderScore },
        gesture: { val: human.result.gesture },
      }));
    }

    canvas.className = "canvas show";
    jsonRef.current.className = "show";
  };

  return (
    <>
      <div className="relative">
        <img ref={imageRef} src={Akira} alt="face" />
        <canvas ref={canvasRef} className="canvas hide"></canvas>
        <button className="block" onClick={startDetection}>
          Start Detection
        </button>
      </div>
      <JsonView
        ref={jsonRef}
        value={resultData}
        style={darkTheme}
        className="hide"
      />
    </>
  );
}

export default App;
