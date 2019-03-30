import React, {useEffect, useMemo, useRef, useState} from 'react';

import "./Curtain.scss";

/** @namespace scrollArea.contentRect */

export default function Curtain({aspect, length, component, children}) {

    let factor;
    switch (aspect) {
        case "16:9":
        default:
            factor = 16 / 9;
    }

    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [topHeight, setTopHeight] = useState(innerWidth / factor);

    const topRef = useRef();
    useEffect(() => {
        const top = topRef.current;
        setTopHeight(top.clientHeight);
    }, [topRef]);

    useEffect(() => {
        topRef.current.className += " opaque";
        const resizeListener = () => {
            const top = topRef.current;
            setTopHeight(top.clientHeight);
            setInnerHeight(window.innerHeight);
        };
        window.addEventListener("resize", resizeListener);
        return function () {
            window.removeEventListener("resize", resizeListener);
        }
    }, []);

    const onResize = ({innerWidth}) => {
        setInnerWidth(innerWidth);
        setTopHeight(Math.min(innerWidth / factor, .75 * innerHeight));
    }

    const marginRight = window.innerWidth - innerWidth;

    function onTopScroll() {
        console.log(...arguments);
    }

    function onScroll() {
        console.log(...arguments);
    }

    return (
        <div className="Curtain">
            <div ref={topRef} className="top" style={{marginRight}} onScroll={onTopScroll}>{component({width: innerWidth, height: topHeight})}</div>
            {useMemo(() => {
                return children({height: innerHeight, paddingTop: topHeight, onResize, onScroll});
            }, [innerHeight, topHeight, onResize, onScroll])}
        </div>
    )
}