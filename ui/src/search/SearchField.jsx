import React, {useEffect, useState} from "react";
import MagnifyingGlass from "../components/svg/MagnifyingGlass";

import "./SearchField.scss";
import {connect} from "react-redux";
import {searchText} from "../redux/selectors";
import {applySearch} from "../redux/actions";
import {withRouter} from "react-router";

const PLACEHOLDER = "search movie...";

export function SearchField({value, onApply}) {

    const [search, setSearch] = useState(value || "");
    const [isSearchFocused, setSearchFocused] = useState(false);
    const [placeholder, setPlaceholder] = useState(PLACEHOLDER);

    useEffect(() => {
        onApply(search);
    }, [search]);

    return (
        <div className="SearchField flex-fill">
            <form autoComplete="off"
                  onSubmit={event => {
                      setSearch(search);
                      event.preventDefault();
                  }}>
                <div className="form-group">
                    <input className="form-control" type="text" name="searchBar" aria-describedby="searchBar"
                           value={search}
                           placeholder={placeholder}
                           onFocus={event => {
                               setPlaceholder("");
                               setSearchFocused(true);
                               setSearch(event.target.value);
                           }}
                           onBlur={event => {
                               setPlaceholder(PLACEHOLDER);
                               setSearchFocused(false);
                               setSearch(event.target.value);
                           }}
                           onChange={event => {
                               setSearch(event.target.value);
                           }}
                    />
                    <MagnifyingGlass focused={isSearchFocused} active={!search} onClose={() => setSearch("")}/>
                </div>
            </form>
        </div>
    )
}

SearchField.Connected = withRouter(connect(
    (state) => ({
        value: searchText(state)
    }),
    (dispatch, {history}) => ({
        onApply: search => {
            if (search) {
                history.push({search: "?query=" + encodeURIComponent(search)});
            } else {
                history.push({search: ""});
            }
            dispatch(applySearch(search));
        }
    })
)(SearchField));