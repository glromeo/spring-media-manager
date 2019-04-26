import React from 'react';

import "./Metadata.scss";

export const Metadata = ({value}) => {

    const {
        fileType,
        duration,
        fileSize,
        imageSize,
        audioChannels,
        audioSampleRate
    } = value;

    return (
        <div className="Metadata">
            <div className="FileType">
                <span>Type:</span>
                <span>{fileType}</span>
            </div>
            <div className="Duration">
                <span>Duration:</span>
                <span>{duration}</span>
            </div>
            <div className="FileSize">
                <span>Size:</span>
                <span>{fileSize}</span>
            </div>
            <div className="Resolution">
                <span>Resolution:</span>
                <span>{imageSize}</span>
            </div>
            <div className="Audio">
                <span>Audio:</span>
                <span>{audioChannels} CH {audioSampleRate} Hz</span>
            </div>
        </div>
    )
}

export default Metadata;