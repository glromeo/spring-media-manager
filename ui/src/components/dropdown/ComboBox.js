import React, {useRef, useState} from 'react';
import {List} from "react-virtualized";

import './ComboBox.scss';

function preventDefault(e) {
    e.preventDefault();
}

export default function ({value, options, onChange, width = 400, maxHeight = 400, rowHeight = 40, placeholder}) {

    const [currentValue, setCurrentValue] = useState(value);
    const listRef = useRef(null);
    const dropdownRef = useRef(null);


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

    const [isOpen, setOpen] = useState(false);
    const [scrollToIndex, setScrollToIndex] = useState(0);

    function toggleMenu(event) {
        setOpen(!isOpen);
    }

    function onKeyDown(event) {
        if (event.defaultPrevented) {
            return;
        }
        switch (event.key) {
            case "Down":
            case "ArrowDown":
                setOpen(true);
                const newIndex = scrollToIndex + 1;
                options.select(newIndex);
                listRef.current.scrollToRow(newIndex);
                break;
            case "Up":
            case "ArrowUp":
                if (scrollToIndex === 0) {
                    setOpen(false);
                } else {
                    const newIndex = scrollToIndex - 1;
                    options.select(newIndex);
                    listRef.current.scrollToRow(newIndex);
                }
                break;
            case "Left":
            case "ArrowLeft":

                break;
            case "Right":
            case "ArrowRight":

                break;
            case "Enter":

                break;
            case "Esc":
            case "Escape":

                break;
            default:
                return;
        }
        event.preventDefault();
    }

    function onSearchChange(event) {
        if (!isOpen) {
            setOpen(true);
        }
        const {value} = event.target;
        return setCurrentValue(value);
    }

    const isArray = Array.isArray(options);
    const rowCount = isArray ? options.length : options.size();
    const height = Math.min(maxHeight, rowHeight * rowCount);
    const getOption = isArray ? index => options[index] : index => options.get(index);
    return (
        <div ref={dropdownRef}
             className={"ComboBox ui fluid search selection dropdown" + (isOpen ? " active visible" : "")}
             style={{width}}>
            <input type="hidden" name="search"/>
            <input className="search" autoComplete="off" tabIndex={0} value={currentValue}
                   placeholder={placeholder} onKeyDown={onKeyDown} onChange={onSearchChange}/>
            <i className="dropdown icon" onClick={toggleMenu}/>
            <List ref={listRef} className={`menu transition ${isOpen ? "visible" : ""}`}
                  style={{maxHeight: height, left: "-1em", top: "1.75em"}}
                  width={width} height={height}
                  rowCount={rowCount}
                  rowHeight={rowHeight}
                  rowRenderer={function rowRenderer({index, isScrolling, key, style}) {
                      let option = getOption(index);
                      if (option instanceof Promise) {
                          option.then(() => listRef.current.forceUpdateGrid()).catch(console.debug);
                          option = null;
                      }
                      return !option ? (
                          <div key={key} data-index={index} className={"item"} style={style} onClick={preventDefault}>
                              <i className="fa fa-spinner fa-pulse fa-fw"/>
                          </div>
                      ) : (
                          <div key={key} data-index={index} className={"item"
                          + (option.selected ? " selected" : "")
                          + (option.value === currentValue ? " active" : "")
                          }
                               style={style}
                               onClick={clickHandler(option)}>
                              {option.value}
                          </div>
                      )
                  }}
                  setScrollToIndex={setScrollToIndex}
            />
        </div>
    );
}
