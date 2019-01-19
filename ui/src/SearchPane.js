import React, {Component} from "react";

import "./SearchPane.scss";
import {connect} from "react-redux";
import {fetchMediaIfNeeded, fetchMovieGenres} from "./redux/actions";

class SearchPane extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            searchFocused: false,
            imageWidth: "50%"
        };
        this.searchPane = React.createRef();
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchMovieGenres());
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        let allowedHeight = this.searchPane.current.parentElement.clientHeight;
        if (allowedHeight !== nextState.allowedHeight) {
            this.setState({allowedHeight});
        }
    }

    render() {
        const {searchFocused, allowedHeight, movieGenres} = this.state;
        const {genres, maxHeight} = this.props;
        return (
            <div className="SearchPane" ref={this.searchPane} style={{height: maxHeight}}>
                <div className="LogoSection m-2">
                    <div/>
                    {(allowedHeight > 68) && (<div className="MovieTicketsImage"/>)}
                    <div/>
                </div>
                <div className="SearchSection mx-2">
                    {(allowedHeight <= 68) && (<div className="MovieTicketsImage"/>)}
                    <form className="SearchBar">
                        <div className="form-group">
                            <input className="form-control" type="text" aria-describedby="movieSearch"
                                   onFocus={() => this.setState({searchFocused: true})}
                                   onBlur={() => this.setState({searchFocused: false})}
                                   placeholder="search movie..."/>
                            <svg data-icon="search" role="img" aria-hidden="true" viewBox="0 0 512 512"
                                 className={searchFocused ? "focused" : ""}>
                                <path fill="currentColor"
                                      d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/>
                            </svg>
                        </div>
                    </form>
                </div>
                <div style={{flex: '.125 .125 auto'}}/>
                <div className="FiltersSection m-2">
                    {(allowedHeight > 68) && (
                        <div className="Genres">
                            <div>
                                {genres.map(genre => (
                                    <button key={genre.id} type="button" style={{fontSize: '1em'}}
                                            className="btn btn-outline-success m-1">{genre.name}
                                        <span className="badge badge-pill badge-dark ml-2">{genre.count || 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(function (state) {
    const {genre} = state;
    const {list: genres = []} = genre;
    return {
        genres
    }
})(SearchPane);