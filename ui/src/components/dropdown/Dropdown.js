import React, {useRef, useState} from 'react';

import 'bootstrap/dist/js/bootstrap.min';
import './Dropdown.scss';
import {List} from "react-virtualized";

function preventDefault(e) {
    e.preventDefault();
}

export default function ({value, options, onChange, width = 400, maxHeight = 400, rowHeight = 40}) {

    const [currentValue, setCurrentValue] = useState(value);
    const listRef = useRef(null);

    function clickHandler(option) {
        return function handler(e) {
            try {
                onChange(option);
            } finally {
                setCurrentValue(option.value);
                e.preventDefault();
            }
        }
    }

    function simpleRowRenderer({index, isScrolling, key, style}) {
        const option = options[index];
        return isScrolling ? (
            <a key={key} href="#" className="dropdown-item" style={style} onClick={preventDefault}>
                ...
            </a>
        ) : (
            <a key={key} href="#"
               className={option.value === currentValue ? "dropdown-item active" : "dropdown-item"}
               style={style}
               onClick={clickHandler(option)}>
                {option.value}
            </a>
        )
    }

    function pagedRowRenderer({index, isScrolling, key, style}) {
        let option = options.get(index);
        if (option instanceof Promise) {
            option.then(() => listRef.current.forceUpdateGrid()).catch(()=>{});
            option = null;
        }
        return isScrolling || !option ? (
            <a key={key} href="#" className="dropdown-item" style={style} onClick={preventDefault}>
                <i className="fa fa-spinner fa-pulse fa-fw"/>
            </a>
        ) : (
            <a key={key} href="#"
               className={option.value === currentValue ? "dropdown-item active" : "dropdown-item"}
               style={style}
               onClick={clickHandler(option)}>
                {option.value}
            </a>
        )
    }

    const isArray = Array.isArray(options);
    const rowCount = isArray ? options.length : options.size();
    return (
        <div className="Dropdown dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {currentValue}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {isArray ? (
                    <List ref={listRef} width={width}
                          height={Math.min(maxHeight, rowHeight * rowCount)}
                          rowCount={rowCount}
                          rowHeight={rowHeight}
                          rowRenderer={simpleRowRenderer}
                    />
                ) : (
                    <List ref={listRef} width={width}
                          height={Math.min(maxHeight, rowHeight * rowCount)}
                          rowCount={rowCount}
                          rowHeight={rowHeight}
                          rowRenderer={pagedRowRenderer}
                    />
                )}
            </div>
        </div>
    );
}
