import { useState, createContext } from "react";

const YogaContext = createContext();

let interval;

export const YogaProvider = ({ children }) => {
  const [startingTime, setStartingTime] = useState(0);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [poseTime,     setPoseTime]     = useState(0);
  const [bestPerform,  setBestPerform]  = useState(0);
  const [currentPose,  setCurrentPose]  = useState("Tree");
  const [isStartPose,  setIsStartPose]  = useState(false);

  const startYoga = (value) => { setIsStartPose(value); };

  function stopPose() {
    setIsStartPose(false);
    clearInterval(interval);
  }

  const startingTimefunc  = (t) => setStartingTime(t);
  const currentTimefunc   = (t) => setCurrentTime(t);
  const poseTimefunc      = (t) => setPoseTime(t);
  const bestPerformfunc   = (t) => setBestPerform(t);
  const setCurrentPosefunc = (p) => setCurrentPose(p);

  return (
    <YogaContext.Provider value={{
      startYoga, stopPose,
      startingTimefunc, currentTimefunc, poseTimefunc, bestPerformfunc, setCurrentPosefunc,
      startingTime, currentTime, poseTime, bestPerform, currentPose, isStartPose,
      interval,
    }}>
      {children}
    </YogaContext.Provider>
  );
};

export default YogaContext;
