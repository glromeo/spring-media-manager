import React, {useRef, useState} from 'react';
import {List} from "react-virtualized";
import './ComboBox.scss';

function preventDefault(e) {
    e.preventDefault();
}

export default function ({value, options, onChange, width = 400, maxHeight = 400, rowHeight = 40, placeholder}) {

    const [currentValue, setCurrentValue] = useState(value);
    const listRef = useRef(null);
    const menuRef = useRef(null);


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
                setTimeout(function () {
                    const first = menuRef.current.querySelector('div.item:first-child');
                    if (first) {
                        first.focus();
                    }
                }, 50);
                break;
            case "Up":
            case "ArrowUp":
                setOpen(false);
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
        <div ref={menuRef} className={"ComboBox ui fluid search selection dropdown" + (isOpen ? " active" : "")}
             style={{width}}>
            <input type="hidden" name="search"/>
            <input className="search" autoComplete="off" tabIndex={0} value={currentValue}
                   placeholder={placeholder} onKeyDown={onKeyDown} onChange={onSearchChange}/>
            <i className="dropdown icon" onClick={toggleMenu}/>
            <List ref={listRef} className={"menu transition" + (isOpen ? " visible" : "")}
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
                      return isScrolling || !option ? (
                          <div key={key} className="item" style={style} onClick={preventDefault}>
                              <i className="fa fa-spinner fa-pulse fa-fw"/>
                          </div>
                      ) : (
                          <div key={key}
                             className={option.value === currentValue ? "item active" : "item"}
                             style={style}
                             onClick={clickHandler(option)}>
                              {option.value}
                          </div>
                      )
                  }}
            />
        </div>
    );
}
