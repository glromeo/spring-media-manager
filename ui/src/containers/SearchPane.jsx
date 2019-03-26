import React, {useEffect} from "react";
import "../SearchPane.scss";
import {connect} from "react-redux";
import {applySearch, fetchMovieGenres} from "../redux/actions";
import {SearchBar} from "../components/SearchBar";
import {Genres} from "../components/Genres";

export default connect(state => {
    const {genre, search} = state;
    const {visible = []} = genre;
    return {
        genres: visible,
        search: search.text
    }
})(function SearchPane({dispatch, search, genres, key, height}) {

    useEffect(() => {
        dispatch(fetchMovieGenres());
    }, []);

    // console.log("rendering search pane");

    return (
        <div key={key} className="SearchPane" style={{height, top: 68-height}}>
            <div className="LogoSection m-2">
                {height > 68 && <div className="MovieTicketsImage"/>}
            </div>
            <div className="SearchSection mx-2">
                {height <= 68 && <div className="MovieTicketsImage"/>}
                <SearchBar value={search} onApply={search=>dispatch(applySearch(search))}/>
            </div>
            <div style={{flex: '.125 .125 auto'}}/>
            <div className="FiltersSection m-2">
                {height > 68 && <Genres genres={genres}/>}
            </div>
        </div>
    );

});