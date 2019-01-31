import React, {Component} from 'react';

import "./Metadata.scss";

class Metadata extends Component {

    render() {

        const {
            fileType,
            duration,
            fileSize,
            imageSize,
            audioChannels,
            audioSampleRate
        } = this.props.value;

        return (
            <div className="Metadata">
                <div>
                    <span>Type:</span>
                    <span>{fileType}</span>
                </div>
                <div>
                    <span>Duration:</span>
                    <span>{duration}</span>
                </div>
                <div>
                    <span>Size:</span>
                    <span>{fileSize}</span>
                </div>
                <div>
                    <span>Resolution:</span>
                    <span>{imageSize}</span>
                </div>
                <div>
                    <span>Audio:</span>
                    <span>{audioChannels} CH {audioSampleRate} Hz</span>
                </div>
            </div>
        );
    }
}

export default Metadata;