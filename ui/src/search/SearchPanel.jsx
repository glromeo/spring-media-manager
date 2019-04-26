import React from "react";
import Genres from "./Genres";
import {SearchField} from "./SearchField";

import "./SearchPanel.scss";

export const MIN_HEIGHT = 68;

export function SearchPanel({height, scrollTop}) {

    const space = 0.75 * (height - MIN_HEIGHT) - scrollTop;
    const topHeight = Math.max(0, Math.round(space));
    const topOpacity = topHeight > 50 ? 1 : 0;
    const bottomHeight = Math.max(0, Math.round(0.25 * (height - MIN_HEIGHT) + Math.min(0, space)));
    const bottomOpacity = bottomHeight > 50 ? 1 : 0;

    return (
        <div className="SearchPanel d-flex flex-column" style={{height}}>
            <div className="Top d-flex flex-column" style={{maxHeight: topHeight}}>
                <div className="MovieTickets" style={{opacity: topOpacity}}/>
            </div>
            <div className="Bar d-flex px-3">
                <div className="MovieTickets" style={{opacity: 1 - topOpacity, width: MIN_HEIGHT, height: MIN_HEIGHT}}/>
                <SearchField.Connected/>
                <div style={{width: MIN_HEIGHT}}></div>
            </div>
            <div className="Bottom d-flex flex-column flex-fill"
                 style={{maxHeight: bottomHeight, opacity: bottomOpacity}}>
                <Genres scale={bottomHeight / 250}/>
            </div>
        </div>
    );

}