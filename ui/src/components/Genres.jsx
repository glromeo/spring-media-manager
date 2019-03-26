import {CSSTransition, TransitionGroup} from "react-transition-group";
import React from "react";

export function Genres({genres}) {
    return <div className="Genres">
        <div>
            <TransitionGroup className="genres-group">
                {genres.map(genre => (
                    <CSSTransition key={genre.id} timeout={500} classNames="fade">
                        <button type="button" className="Genre btn btn-outline-success">
                            {genre.name}
                            {genre.total ? (
                                <span
                                    className="badge badge-pill badge-dark ml-2">{genre.count || 0} / {genre.total}
                                </span>
                            ) : null}
                        </button>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    </div>;
}