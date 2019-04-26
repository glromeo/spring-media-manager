import React, {useState} from 'react';
import {Link} from "react-router-dom";

import "./Poster.scss";

export const Poster = ({movie}) => {
    const [isPosterLoaded, setPosterLoaded] = useState(false);
    return (
        <div className="Poster">
            {!isPosterLoaded && <div className="lds-roller">
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>}
            <img src={"/api/poster/" + movie.id + "/small"} alt="poster"
                 style={{visibility: isPosterLoaded ? "visible" : "hidden"}}
                 onLoad={() => setPosterLoaded(true)}
                 onError={() => console.error}/>
            {isPosterLoaded && <Link className="Play fa fa-play-circle-o" to={`/watch/${movie.id}`}
                                     onClick={e => e.stopPropagation()}/>}
        </div>
    )
}