import React, {useMemo, useRef, useState} from 'react';
import {CSSTransition, TransitionGroup,} from 'react-transition-group';
import "./Autosuggest.scss";

/** @namespace suggestion.suffix */

export default function Autosuggest(props) {

    const {
        defaultKey,
        defaultValue,
        suggestions: unfiltered,
        placeholder,
        style,
        maxWidth,
        maxHeight,
        onChange,
        children
    } = props;

    const suggestions = useMemo(() => {
        if (unfiltered) {
            return unfiltered.filter(function applyQuery(queryRef) {
                if (queryRef.current) {
                    const queryRegExp = new RegExp(queryRef.current.innerText || ".*", "i");
                    return ({value}) => queryRegExp.test(value);
                } else {
                    return () => true;
                }
            });
        } else {
            return [];
        }
    }, [unfiltered]);

    const [key, setKey] = useState(defaultKey);
    const [value, setValue] = useState(defaultValue);
    const [isOpen, setOpen] = useState(false);
    const [isPlaceholderVisible, setPlaceholderVisible] = useState(!defaultValue);

    const openMenu = () => {
        if (!suggestions.length) {
            onChange({key, value});
        }
        setOpen(true)
    };
    const closeMenu = () => setOpen(false);

    const queryRef = useRef(null);
    const dropdownRef = useRef(null);

    function selectedClass(k) {
        return key === k ? "selected" : "";
    }

    const renderSuggestion = ({key, value, suffix}, index) => {
        return (
            <div key={key}
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
                    <span className={"Text flex-fill " + selectedClass(key)}>
                        {value}
                    </span>
                {suffix && <span className="Suffix">{suffix}</span>}
            </div>
        );
    };

    const [focusedIndex, setFocusedIndex] = useState(0);

    let changeTimeout;

    function onKeyDown(e) {
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
                if (suggestions.length) {
                    const {key, value} = suggestions[focusedIndex];
                    setKey(key);
                    setValue(value);
                    setPlaceholderVisible(false);
                    onChange({key, value});
                    closeMenu();
                }
                break;
            case "Esc":
            case "Escape":
                closeMenu();
                break;
            default:
                return
        }
        e.preventDefault();
    }

    return (
        <div className="Autosuggest dropdown" style={style}>
            <div className="form-group m-0" style={{whiteSpace: "nowrap"}}>
                <div className={"d-flex form-control " + (key ? "border-primary" : "border-danger")}>
                    {isPlaceholderVisible && (
                        <p className={"placeholder"}
                           onClick={e => {
                               queryRef.current.focus();
                               e.stopPropagation();
                           }}>
                            {placeholder}
                        </p>
                    )}
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
                       onKeyDown={onKeyDown}>
                        {value}
                    </p>
                    <TransitionGroup className="Icons d-flex align-content-stretch">
                        <CSSTransition timeout={0}>
                            <div className="flex-fill"/>
                        </CSSTransition>
                        {children}
                    </TransitionGroup>
                </div>
            </div>
            {suggestions.length ? (
                <div className={"dropdown-menu " + (isOpen && "show")} style={{maxWidth, maxHeight}} ref={dropdownRef}>
                    {isOpen && suggestions.map(renderSuggestion)}
                </div>
            ) : null}
        </div>
    );
}
