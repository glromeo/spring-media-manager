import React, {Component} from "react";
import {fetchMediaIfNeeded} from "./redux/actions";
import {List, WindowScroller} from "react-virtualized";
import Movie from "./Movie";
import "./Movies.scss";
import {connect} from "react-redux";

class Movies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
        this.listRef = React.createRef();
        this.renderRow = this.renderRow.bind(this);
    }

    componentDidMount() {
        const {dispatch, searchFilters} = this.props;
        dispatch(fetchMediaIfNeeded(searchFilters));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.searchFilters !== prevProps.searchFilters) {
            const {dispatch, searchFilters} = this.props;
            dispatch(fetchMediaIfNeeded(searchFilters));
        }
    }

    renderRow({index, isScrolling, key, style}) {
        const {list} = this.props;
        const {selected} = this.state;
        const media = list[index];
        const {movie, metadata} = media;
        return (
            <div key={key} className={selected === media ? "Media selected" : "Media"} style={style}
                 onClick={({event}) => {
                     this.setState({selected: media});
                     this.listRef.current.forceUpdateGrid();
                 }}>{movie ? (
                <Movie movie={movie} metadata={metadata}/>
            ) : (
                <div className="Unknown">
                    <div className="Letter" style={{backgroundColor: media.color}}>{media.letter || '?'}</div>
                    <div className="Info">{media.path}</div>
                </div>
            )}
            </div>
        );
    }

    render() {
        const {isFetching, list, width = 0} = this.props;
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
    const {media} = state;
    const {isFetching, list = []} = media;
    return {
        isFetching,
        list
    };
})(Movies);