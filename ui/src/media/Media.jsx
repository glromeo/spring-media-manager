import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {fetchMedia, selectMedia} from "../redux/actions";
import {List} from "../components/virtualized/List";
import Card from "./Card";
import "./Media.scss";
import {useWindowResizeEvent} from "../hooks/useWindowResizeEvent";
import {filteredMediaList} from "../redux/selectors";

export const Media = connect(state => {
    const {media} = state;
    return {
        ...media,
        list: filteredMediaList(state)
    };
})(function ({dispatch, isFetching, list, selected, edit, panel, footer}) {

    useEffect(() => {
        dispatch(fetchMedia());
    }, []);

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const listRef = useRef(null);

    useWindowResizeEvent(function () {
        if (width !== window.innerWidth) {
            setWidth(window.innerWidth);
        }
        if (height !== window.innerHeight) {
            setHeight(window.innerHeight);
        }
    });

    const itemCount = list.length;

    function itemSize(index) {
        return 180;
    }

    function renderItem(height, index) {

        const media = list[index];
        const draft = media.draft || !media.movie;

        //console.log("rendering item", height, index);

        return (
            <div key={index} data-row={index}
                 className={selected === media ? "selected" : ""}
                 style={{height}}
                 onClick={() => dispatch(selectMedia(media))}>
                <Card media={media} edit={edit || draft}
                      onChange={media => {
                          list[index] = media;
                          listRef.current.redraw();
                      }}/>
            </div>
        )
    }

    // console.log("rendering media list", width, height);

    return isFetching ? (
        <div/>
    ) : (
        <List apiRef={listRef} className="Media"
              style={{
                  paddingBottom: 10
              }}
              height={height}
              itemCount={itemCount}
              itemSize={itemSize}
              renderItem={renderItem}>
            {panel ? scrollTop => panel({width, height, scrollTop}) : null}
            {footer}
        </List>
    )
});