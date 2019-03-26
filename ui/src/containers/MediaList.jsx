import React, {useEffect, useRef, useState} from "react";
import {connect} from "react-redux";
import {fetchMediaIfNeeded, selectMedia} from "../redux/actions";
import List from "../components/virtualized/List";
import Media from "../Media";
import "./MediaList.scss";


function useWindowResizeEvent(resizeCallback) {
    useEffect(() => {
        window.addEventListener("resize", resizeCallback);
        return () => {
            window.removeEventListener("resize", resizeCallback);
        }
    }, []);
}

function renderItem(height, index) {
    const {listRef, list, selected, searchWords, editable, onClick} = this;
    const media = list[index];
    const draft = media.draft || !media.movie;
    // console.log("outer rendering", height, index);
    return (
        <div key={index} data-row={index}
             className={selected === media ? "selected" : ""}
             style={{height}}
             onClick={onClick}>
            <Media media={media} searchWords={searchWords} editable={editable || draft}
                   onSave={media => {
                       console.log("saving media...");
                       list[index] = media;
                       listRef.current.forceUpdateGrid();
                   }}/>
        </div>
    )
}

function itemSize(index) {
    return index === 0 ? window.innerWidth * 9 / 16 : 180;
}

export default connect(state => {
    const {media, search} = state;
    const {isFetching, visible: list = [], selected} = media;
    const searchWords = search.text ? [new RegExp(search.text, "i")] : [];
    return {
        isFetching,
        list,
        lastIndex: list.length - 1,
        selected,
        searchWords
    };
})(function MediaList(
    {
        dispatch,
        isFetching,
        list,
        lastIndex,
        selected,
        searchWords,
        editable,
        header,
        searchFilters
    }
) {

    const listRef = useRef();

    useEffect(() => {
        dispatch(fetchMediaIfNeeded(searchFilters));
    }, [searchFilters]);

    const itemCount = list.length;

    const [{width, height}, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useWindowResizeEvent(function () {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
        listRef.current.redraw(0);
    });

    // console.log("rendering media list", width, height);

    return (
        <List apiRef={listRef}
              height={height}
              itemCount={itemCount}
              itemSize={itemSize}
              override={{0: height => header({width, height})}}
              renderItem={renderItem.bind({
                  listRef, 
                  list, 
                  selected, 
                  searchWords,
                  editable, 
                  onClick: media => dispatch(selectMedia(media))
              })}
        />
    )
});