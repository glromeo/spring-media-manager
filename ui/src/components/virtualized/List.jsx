import React, {useEffect, useMemo, useRef, useState} from "react";
import ResizeObserver from 'resize-observer-polyfill';

const OVERSCAN = 720; // TODO: fix sticky element gap

function calculateItemHeights(itemCount, itemSize) {
    const heights = Array(itemCount);
    let index = heights.length;
    while (index-- > 0) {
        heights[index] = itemSize(index);
    }
    return heights;
}

function useResizeObserver(viewportRef, scrollAreaRef, onResize) {
    useEffect(() => {
        const viewport = viewportRef.current;
        const scrollArea = scrollAreaRef.current;
        const resizeObserver = new ResizeObserver(([entry]) => {
            onResize({outerWidth: entry.width, innerWidth: scrollArea.clientWidth});
        });
        resizeObserver.observe(viewport);
        return () => {
            resizeObserver.disconnect();
        }
    }, [viewportRef, scrollAreaRef, onResize]);
}

function renderItems(itemCount, itemHeights, renderItem, itemSize, scrollTop, height, cache) {

    const items = [];

    let top = 0, threshold = Math.max(0, scrollTop - OVERSCAN);
    let index = 0;

    while (index < itemCount) {
        const itemHeight = itemHeights[index];
        if (top + itemHeight > threshold) {
            break;
        } else {
            top += itemHeight;
            ++index;
        }
    }
    items.push(<div key={-1} style={{height: top}}/>);

    threshold = scrollTop + height + OVERSCAN;

    while (index < itemCount) {
        const itemHeight = itemHeights[index];
        items.push(cache[index] || (cache[index] = renderItem(itemHeight, index)));
        if (top + itemHeight > threshold) {
            break;
        } else {
            top += itemHeight;
            ++index;
        }
    }

    let bottom = top;
    while (index < itemCount) {
        top += itemHeights[index];
        ++index;
    }
    items.push(<div key={-2} style={{height: top - bottom}}/>);

    return items;
}

export function List(props) {

    const {
        apiRef,
        className = "List",
        style,
        width = "100%",
        height,
        itemCount,
        itemSize,
        renderItem,
        children = [],
        onResize,
        onScroll,
        scrollTo = 0
    } = props;

    const [updated, forceUpdate] = useState(false);

    const [scrollTop, setScrollTop] = useState(scrollTo);

    function handleScroll({target}) {
        if (viewportRef.current === target) {
            // console.log("handleScroll", distance);
            const distance = Math.abs(target.scrollTop - scrollTop);
            setScrollTop(target.scrollTop);
            if (onScroll) onScroll({distance, scrollTop: target.scrollTop});
        }
    }

    const viewportRef = useRef(null);
    const scrollAreaRef = useRef(null);
    if (onResize) useResizeObserver(viewportRef, scrollAreaRef, onResize);

    const itemHeights = useMemo(() => {
        // console.log(`calculating item heights - itemCount: ${itemCount}, itemSize: ${itemSize}`);
        return calculateItemHeights(itemCount, itemSize);
    }, [itemCount, itemSize, children]);

    const cache = useMemo(() => {
        return {};
    }, [renderItem]);

    if (apiRef) apiRef.current = {
        redraw(index) {
            if (index !== undefined) {
                const newHeight = itemHeights[index] = itemSize(index);
                cache[index] = renderItem(newHeight, index);
            } else {
                calculateItemHeights(itemCount, itemSize).forEach((h, i) => {
                    const newHeight = itemHeights[i] = h;
                    cache[i] = renderItem(newHeight, i);
                });
                Object.keys(cache).forEach(key => delete cache[key]);
            }
            forceUpdate(!updated);
        }
    };

    const items = useMemo(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTop = scrollTop;
        }
        return renderItems(itemCount, itemHeights, renderItem, itemSize, scrollTop, height, cache);
    }, [scrollTop, height, itemHeights, updated, style]);

    // console.log("rendering list", items.length);

    useEffect(() => {
        console.log("scrolling to: ", scrollTo);
        setScrollTop(scrollTo);
    }, [scrollTo]);

    const header = children[0] || children;
    const footer = children[1];

    return (
        <div className={`${className} viewport`} ref={viewportRef} onScroll={handleScroll} style={{
            ...style,
            width,
            height,
            overflowY: 'auto'
        }}>
            <div className="scroll-area" ref={scrollAreaRef}>
                {typeof header === "function" ? header(scrollTop) : header}
                {items}
                {typeof footer === "function" ? footer(scrollTop) : footer}
            </div>
        </div>
    )
}
