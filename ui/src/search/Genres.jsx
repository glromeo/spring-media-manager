import React, {useEffect} from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {connect} from "react-redux";
import {fetchMovieGenres} from "../redux/actions";
import {movieGenres} from "../redux/selectors";

import "./Genres.scss";

function Badge({count, total}) {
    const badgeClass = count === total ? "badge-success" : "badge-primary";
    return <span className={`badge badge-pill ${badgeClass} ml-2`}>{count}</span>
}

export default connect(state => {
    return {
        genres: movieGenres(state)
    }
})(function Genres({dispatch, genres, scale = 1}) {

    useEffect(() => {
        dispatch(fetchMovieGenres());
    }, []);

    return (
        <TransitionGroup className="Genres d-flex justify-content-center">
            {genres.map(genre => (
                <CSSTransition key={genre.id} timeout={500} classNames="fade">
                    <div className="Genre" style={{width: 94 * scale, height: 94 * scale}}>
                        <div className={`Icon ${genre.name}`}
                             style={{
                                 transform: `scale(${scale})`
                             }}/>
                        <Badge count={genre.count} total={genre.total}/>
                    </div>
                </CSSTransition>
            ))}
        </TransitionGroup>
    )
});