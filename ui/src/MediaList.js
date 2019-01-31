import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchMediaIfNeeded, selectMedia} from "./redux/actions";
import {List, WindowScroller} from "react-virtualized";
import Media from "./Media";
import "./MediaList.scss";

class MediaList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            selected: null
        };
        this.listRef = React.createRef();
        this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount() {
        const {dispatch, searchFilters} = this.props;
        dispatch(fetchMediaIfNeeded(searchFilters));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {dispatch, searchFilters, selected} = this.props;
        if (searchFilters !== prevProps.searchFilters) {
            dispatch(fetchMediaIfNeeded(searchFilters));
        }
        if (selected !== prevProps.selected) {
            this.setState({selected});
            this.listRef.current.forceUpdateGrid();
        }
    }

    renderRow({index, isScrolling, key, style}) {
        const {editable, dispatch, list, searchWords} = this.props;
        const {selected} = this.state;
        const media = list[index];
        const draft = media.draft || !media.movie;
        return (
            <div key={key} className={selected === media ? "selected" : ""} style={style}
                 onClick={({event}) => {
                     dispatch(selectMedia(media))
                 }}>
                <Media media={media} searchWords={searchWords} editable={editable || draft}
                       onSave={media => {
                           console.log("saving media...");
                           list[index] = media;
                           this.listRef.current.forceUpdateGrid();
                       }}/>
            </div>
        );
    }

    render() {
        const {list, width = 0} = this.props;
        return (
            <div className="Movies">
                <WindowScroller>
                    {({height, isScrolling, onChildScroll, scrollTop}) => (
                        <List ref={this.listRef}
                              autoHeight
                              height={height}
                              width={width}
                              scrollTop={scrollTop}
                              isScrolling={isScrolling}
                              onScroll={onChildScroll}
                              rowCount={list.length}
                              rowHeight={200}
                              rowRenderer={this.renderRow}
                              estimatedRowSize={200}
                        />
                    )}
                </WindowScroller>
            </div>
        );
    }
}

export default connect(function (state) {
    const {media, search} = state;
    const {isFetching, visible: list = [], selected} = media;
    const searchWords = search.text ? [new RegExp(search.text, "i")] : [];
    return {
        isFetching,
        list,
        selected,
        searchWords
    };
})(MediaList);