import React, {useRef, useState} from 'react';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import "./Autosuggest.scss";

function applyQuery(queryRef) {
    if (queryRef.current) {
        const queryRegExp = new RegExp(queryRef.current.innerText || ".*", "i");
        return ({value}) => queryRegExp.test(value);
    } else {
        return () => true;
    }
}

/** @namespace suggestion.suffix */

export default function Autosuggest({defaultKey, defaultValue, suggestions, placeholder, style, maxHeight, onChange, children}) {

    const [defaults] = useState({key: defaultKey, value: defaultValue});

    const [key, setKey] = useState(defaultKey);
    const [value, setValue] = useState(defaultValue);
    const [isOpen, setOpen] = useState(false);
    const [isPlaceholderVisible, setPlaceholderVisible] = useState(!defaultValue);

    const openMenu = () => {
        if (!suggestions) {
            onChange({key, value});
        }
        setOpen(true)
    };
    const closeMenu = () => setOpen(false);

    const queryRef = useRef();
    const dropdownRef = useRef();

    const renderSuggestion = ({key, value, suffix}, index) => {
        return (
            <a key={key} href={"#" + key}
               className={"dropdown-item d-flex " + (index === focusedIndex && "bg-primary text-white")}
               onMouseDown={e => {
                   setFocusedIndex(index);
                   e.preventDefault();
               }}
               onMouseUp={() => {
                   setKey(key);
                   setValue(value);
                   setPlaceholderVisible(false);
                   onChange({key, value});
                   closeMenu();
               }}>
                    <span className="value flex-fill" style={{fontWeight: key === key && "bold"}}>
                        {value}
                    </span>
                {suffix && <span style={{marginLeft: 20, opacity: 0.75}}>{suffix}</span>}
            </a>
        );
    };

    const [focusedIndex, setFocusedIndex] = useState(0);

    let changeTimeout;

    return (
        <div className="Autosuggest dropdown" style={style}>
            <div className="form-group m-0" style={{whiteSpace: "nowrap"}}>
                <div className={"form-control " + (key ? "border-primary" : "border-danger")}
                     style={{minWidth: 100, ...style}}>
                    <p className={"query " + (key && "selected")} ref={queryRef} defaultkey={defaultKey}
                       contentEditable
                       suppressContentEditableWarning
                       onBlur={closeMenu}
                       onFocus={openMenu}
                       onClick={openMenu}
                       onInput={() => {
                           const value = queryRef.current.innerText;
                           clearTimeout(changeTimeout);
                           changeTimeout = setTimeout(() => {
                               onChange({value});
                               changeTimeout = undefined;
                           }, 250);
                           setKey(undefined);
                           setPlaceholderVisible(!value);
                       }}
                       onKeyDown={e => {
                           switch (e.key) {
                               case "Down":
                               case "ArrowDown":
                                   openMenu();
                                   if (suggestions.length) {
                                       setFocusedIndex((focusedIndex + 1) % suggestions.length);
                                   }
                                   break;
                               case "Up":
                               case "ArrowUp":
                                   if (suggestions.length) {
                                       setFocusedIndex((focusedIndex - 1) % suggestions.length);
                                   }
                                   break;
                               case "Enter":
                                   const {key, value} = suggestions[focusedIndex];
                                   setKey(key);
                                   setValue(value);
                                   setPlaceholderVisible(false);
                                   onChange({key, value});
                                   closeMenu();
                                   break;
                               case "Esc":
                               case "Escape":
                                   closeMenu();
                                   break;
                               default:
                                   return
                           }
                           e.preventDefault();
                       }}>
                        {value}
                    </p>
                    <TransitionGroup className="d-flex align-content-stretch">
                        <CSSTransition timeout={0}>
                            <div className="flex-fill"/>
                        </CSSTransition>
                        {children}
                        {key && (
                            <CSSTransition in={!!key} timeout={300} classNames="fade" unmountOnExit>
                                <i className={"fa fa-times text-danger "} onClick={e => {
                                    setKey(defaults.key);
                                    setValue(defaults.value);
                                    setPlaceholderVisible(!value);
                                    e.stopPropagation();
                                }}/>
                            </CSSTransition>
                        )}
                    </TransitionGroup>
                    {isPlaceholderVisible && (
                        <div className={"placeholder"}
                             onClick={e => {
                                 queryRef.current.focus();
                                 e.stopPropagation();
                             }}>
                            {placeholder}
                        </div>
                    )}
                </div>
            </div>
            {suggestions && (
                <div className={"dropdown-menu " + (isOpen && "show")} style={{maxHeight}} ref={dropdownRef}>
                    {isOpen && suggestions.filter(applyQuery(queryRef)).map(renderSuggestion)}
                </div>
            )}
        </div>
    );
}
