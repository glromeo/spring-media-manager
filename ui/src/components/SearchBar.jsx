import React, {useState} from "react";
import MagnifyingGlass from "./svg/MagnifyingGlass";

export function SearchBar({value = "", onApply}) {

    const [search, setSearch] = useState(value);
    const [isSearchFocused, setSearchFocused] = useState(false);

    return (
        <form autoComplete="off" className="SearchBar"
              onSubmit={event => {
                  onApply(search);
                  event.preventDefault();
              }}>
            <div className="form-group">
                <input className="form-control" type="text" name="searchBar" aria-describedby="searchBar"
                       value={search}
                       placeholder="search movie..."
                       onFocus={event => {
                           setSearchFocused(true);
                           setSearch(event.target.value);
                           onApply(search);
                       }}
                       onBlur={event => {
                           setSearchFocused(false);
                           setSearch(event.target.value);
                           onApply(search);
                       }}
                       onChange={event => {
                           setSearch(event.target.value);
                       }}
                />
                <MagnifyingGlass focused={isSearchFocused}/>
            </div>
        </form>
    )
}