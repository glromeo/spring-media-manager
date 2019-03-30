import React, {useEffect} from "react";
import "./SearchPane.scss";
import {connect} from "react-redux";
import {applySearch, fetchMovieGenres} from "../redux/actions";
import {SearchBar} from "../components/SearchBar";
import {Genres} from "../components/Genres";

const MIN_HEIGHT = 68;

export default connect(state => {
    const {genre, search} = state;
    const {visible = []} = genre;
    return {
        genres: visible,
        search: search.text
    }
})(function SearchPane({dispatch, search, genres, height, scrollTop}) {

    useEffect(() => {
        dispatch(fetchMovieGenres());
    }, []);

    const searchHeight = 52;
    const bottomHeight = 104;
    const imageHeight = Math.max(0, height - scrollTop) - searchHeight - bottomHeight;

    return (
        <div className="SearchPane" style={{height}}>
            <div className="LogoSection m-2">
                {height > MIN_HEIGHT && <div className="MovieTicketsImage" style={{height: imageHeight}}/>}
            </div>
            <div className="SearchSection mx-2">
                {height <= MIN_HEIGHT && <div className="MovieTicketsImage"/>}
                <SearchBar value={search} onApply={search => dispatch(applySearch(search))}/>
            </div>
            <div style={{flex: '.125 .125 auto'}}/>
            <div className="FiltersSection m-2">
                {height > MIN_HEIGHT && <Genres genres={genres}/>}
            </div>
        </div>
    );

});