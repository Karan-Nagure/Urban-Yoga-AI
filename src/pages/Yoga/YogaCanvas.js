import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { useRef, useEffect, useContext } from "react";
import YogaContext from "../../YogaContext";
import { poseImages } from "../../utils/pose_images";
import { POINTS, keypointConnections } from "../../utils/data";
import { drawPoint, drawSegment } from "../../utils/helper";
import Webcam from "react-webcam";
import { count } from "../../utils/music";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { api } from "../../utils/api";
import "./Yoga.css";
import "./YogaCanvas.css";

let flag = false;
let skeletonColor = "rgb(255,0,0)";
let interval;

function YogaCanvas() {
  const { user } = useAuth();
  const {
    stopPose,
    isStartPose,
    startingTime,
    startingTimefunc,
    currentTime,
    currentTimefunc,
    poseTime,
    poseTimefunc,
    bestPerform,
    bestPerformfunc,
    currentPose,
  } = useContext(YogaContext);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) poseTimefunc(timeDiff);
    if ((currentTime - startingTime) / 1000 > bestPerform) bestPerformfunc(timeDiff);
  // eslint-disable-next-line
  }, [currentTime]);

  useEffect(() => {
    currentTimefunc(0);
    poseTimefunc(0);
    bestPerformfunc(0);
  // eslint-disable-next-line
  }, [currentPose]);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // CLASS_NO must match the model's output classes
  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Shoulderstand: 4,
    Traingle: 5,
    Tree: 6,
    Warrior: 7,
    // New poses — add their class index here when model is retrained
  };

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    let shoulders_center = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center_new = tf.expandDims(pose_center_new, 1);
    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, "euclidean", 0));
    return tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist);
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);
    let pose_size = get_pose_size(landmarks);
    return tf.div(landmarks, pose_size);
  }

  function landmarks_to_embedding(landmarks) {
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    return tf.reshape(landmarks, [1, 34]);
  }

  const runMovenet = async () => {
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel(
      "https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
    );
    const countAudio = new Audio(count);
    countAudio.loop = true;
    interval = setInterval(() => detectPose(detector, poseClassifier, countAudio), 100);
  };

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints;
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === "left_eye" || keypoint.name === "right_eye")) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
              let connections = keypointConnections[keypoint.name];
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(ctx, [keypoint.x, keypoint.y], [keypoints[POINTS[conName]].x, keypoints[POINTS[conName]].y], skeletonColor);
                });
              } catch (err) {}
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });
        if (notDetected > 4) { skeletonColor = "rgb(255,0,0)"; return; }
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);
        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          if (classNo === undefined) {
            // New pose not in model yet — show guidance only
            skeletonColor = "rgb(255,165,0)";
            return;
          }
          if (data[0][classNo] > 0.97) {
            if (!flag) {
              countAudio.play();
              startingTimefunc(new Date(Date()).getTime());
              flag = true;
            }
            currentTimefunc(new Date(Date()).getTime());
            skeletonColor = "rgb(0,255,0)";
          } else {
            flag = false;
            skeletonColor = "rgb(255,0,0)";
            countAudio.pause();
            countAudio.currentTime = 0;
          }
        });
      } catch (err) { console.log(err); }
    }
  };

  const saveAndStop = async () => {
    // Save session to DB if user is logged in
    if (user && poseTime > 0) {
      try {
        await api.saveSession({
          pose_name:    currentPose,
          duration_sec: poseTime,
          best_sec:     bestPerform,
        });
      } catch (e) { /* silent fail — offline or not logged in */ }
    }
    stopPose();
  };

  const width = window.screen.width;
  const isNewPose = !["Tree", "Chair", "Cobra", "Warrior", "Dog", "Shoulderstand", "Traingle"].includes(currentPose);

  if (isStartPose) {
    runMovenet();
    return (
      <div className="yoga-pose-container">
        {/* Top bar */}
        <div className="canvas-top-bar">
          <div className="canvas-brand">
            <span className="canvas-brand-dot" />
            <span className="canvas-brand-text">Urban<em>Yoga</em></span>
          </div>
          <div className="performance-container">
            <div className="pose-performance">
              <h4>⏱ Pose Time: <strong>{poseTime}s</strong></h4>
            </div>
            <div className="pose-performance">
              <h4>🏆 Best: <strong>{bestPerform}s</strong></h4>
            </div>
          </div>
          <button onClick={saveAndStop} className="secondary-btn">
            <Link to="/start">✕ Stop</Link>
          </button>
        </div>

        {/* Status indicator */}
        <div className="skeleton-status">
          <div className={`status-dot ${skeletonColor === "rgb(0,255,0)" ? "green" : "red"}`} />
          <span>{skeletonColor === "rgb(0,255,0)" ? "Perfect Pose! 🎉" : isNewPose ? `${currentPose} — Instructions only` : "Adjust your pose..."}</span>
        </div>

        {/* Main detection area */}
        <div className="pose-detection">
          <div className="detection-container">
            <Webcam
              width={width >= 480 ? "640px" : "360px"}
              height={width >= 480 ? "480px" : "270px"}
              id="webcam"
              className="webcam"
              ref={webcamRef}
            />
            <canvas
              ref={canvasRef}
              id="my-canvas"
              className="my-canvas"
              width={width >= 480 ? "640px" : "360px"}
              height={width >= 480 ? "480px" : "270px"}
            />
          </div>
          <div className="pose-img">
            <div className="pose-img-label">Reference Pose</div>
            <img src={poseImages[currentPose]} alt="poses" />
            {isNewPose && (
              <div className="new-pose-notice">
                ℹ️ AI detection for {currentPose} coming soon — follow the instructions manually.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default YogaCanvas;
