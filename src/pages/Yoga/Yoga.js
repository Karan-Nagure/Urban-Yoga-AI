import { useContext } from "react";
import Instructions from "../../components/Instrctions/Instructions";
import YogaContext from "../../YogaContext";
import "./Yoga.css";
import DropDown from "../../components/DropDown/DropDown";
import { Link } from "react-router-dom";

let poseList = [
  "Tree", "Chair", "Cobra", "Warrior", "Dog",
  "Shoulderstand", "Traingle", "Lotus", "Pigeon", "Bridge",
];

function Yoga() {
  const { startYoga, currentPose } = useContext(YogaContext);

  const difficultyMap = {
    Tree: "Easy", Chair: "Easy", Cobra: "Easy", Bridge: "Easy",
    Dog: "Medium", Traingle: "Medium", Lotus: "Medium", Pigeon: "Medium",
    Warrior: "Hard", Shoulderstand: "Hard",
  };

  const diff = difficultyMap[currentPose] || "Medium";
  const diffColor = { Easy: "#7a9e7e", Medium: "#e6a817", Hard: "#c9714a" }[diff];

  return (
    <div className="yoga-container">
      {/* Header */}
      <header className="yoga-header">
        <Link to="/" className="yoga-back-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>
        <div className="yoga-header-brand">
          <span className="yoga-brand-dot" />
          <span className="yoga-brand-name">Urban<em>Yoga</em></span>
        </div>
        <Link to="/tutorials" className="yoga-tutorials-link">Tutorials</Link>
      </header>

      {/* Main content */}
      <div className="yoga-main">
        {/* Left panel: controls */}
        <div className="yoga-panel">
          <div className="yoga-panel-top">
            <div className="pose-select-label">Select Your Pose</div>
            <DropDown poseList={poseList} />
            <div className="pose-meta">
              <span className="pose-meta-name">{currentPose}</span>
              <span className="pose-meta-diff" style={{ background: `${diffColor}22`, color: diffColor, border: `1px solid ${diffColor}44` }}>
                {diff}
              </span>
            </div>
          </div>

          <div className="yoga-instructions-wrap">
            <div className="instructions-heading">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Instructions
            </div>
            <Instructions />
          </div>

          <div className="yoga-actions">
            <button onClick={startYoga(true)} className="yoga-start-btn">
              <Link to="/yoga">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <polygon points="5,3 15,9 5,15" fill="currentColor"/>
                </svg>
                Start Pose Detection
              </Link>
            </button>
            <Link to="/" className="yoga-home-btn">Back to Home</Link>
          </div>
        </div>

        {/* Right panel: tips */}
        <div className="yoga-tips-panel">
          <div className="tips-card">
            <div className="tips-title">
              <span>💡</span> Tips for Best Results
            </div>
            <ul className="tips-list">
              <li>Stand 6–8 feet from your camera</li>
              <li>Make sure your full body is visible</li>
              <li>Use good lighting — face a window if possible</li>
              <li>Wear fitted clothing so keypoints are visible</li>
              <li>Skeleton turns <span className="tip-green">green</span> when pose is correct</li>
            </ul>
          </div>
          <div className="tips-card camera-card">
            <div className="tips-title">
              <span>📷</span> Camera Issues?
            </div>
            <ul className="tips-list">
              <li>Allow camera permission in your browser</li>
              <li>Close other apps using the camera</li>
              <li>Try closing and reopening the browser</li>
            </ul>
          </div>
          <div className="pose-count-card">
            <div className="pose-count-num">{poseList.length}</div>
            <div className="pose-count-label">Poses Available</div>
            <div className="pose-count-dots">
              {poseList.map((p, i) => (
                <span key={i} className={`pose-count-dot ${p === currentPose ? 'active' : ''}`} title={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Yoga;
