import React, { useContext } from 'react'
import YogaContext from "../../YogaContext";
import { poseInstructions } from '../../utils/data'
import { poseImages } from '../../utils/pose_images'
import './Instructions.css'

export default function Instructions() {
    const { currentPose } = useContext(YogaContext);
    const instructions = poseInstructions[currentPose] || ['No instructions available for this pose yet.'];
    const image = poseImages[currentPose];

    return (
        <div className="instructions-container">
            <ol className="instructions-list">
                {instructions.map((instruction, idx) => (
                    <li className="instruction" key={idx}>{instruction}</li>
                ))}
            </ol>
            {image && (
                <img
                    className="pose-demo-img"
                    src={image}
                    alt={currentPose}
                />
            )}
        </div>
    )
}
