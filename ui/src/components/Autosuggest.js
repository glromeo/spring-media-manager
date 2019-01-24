import React, {Component} from 'react';
import {debounce} from "lodash";
import "./Autosuggest.scss";

const KEY_CODE = {
    PageDown: 0x22,
    ArrowDown: 0x28,
    PageUp: 0x21,
    ArrowUp: 0x26,
    Tab: 0x09,
    Esc: 0x1B,
};

class Autosuggest extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            suggestions: this.props.suggestions,
            isValid: this.props.suggestions.map(s => s.text).some(txt => txt === this.props.value)
        }
    }

    dropdownMenuRef = React.createRef();

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.suggestions !== this.props.suggestions) {
            this.setState({
                suggestions: this.filterSuggestions(nextProps.suggestions, nextProps.text),
                fetching: false
            });
        }
    }

    filterSuggestions(suggestions, text) {
        const regExp = new RegExp(text || ".*", "i");
        return suggestions.filter(({value}) => {
            return value.match(regExp);
        });
    }

    onChange = ({target}) => {
        const text = target.value;
        if (!this.state.fetching) this.setState({
            suggestions: this.filterSuggestions(this.state.suggestions, text),
            fetching: true
        });
        if (this.props.onChange) this.propagateChange(text);
    };

    propagateChange = debounce(value => {
        this.props.onChange({event, query: value});
    }, 1000);

    onApply = event => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            const {key, value} = event.target;
            this.setState({isValid: key});
            if (this.onApply) {
                this.onApply(value);
            }
        }, 100);
        event.preventDefault();
        event.stopPropagation();
    };

    render() {
        const {placeholder, value} = this.props;
        const {fetching, suggestions, isValid} = this.state;
        return (
            <div className="dropdown">
                <div className="form-group" data-toggle="dropdown">
                    <input className="form-control" style={{borderColor: isValid ? undefined : "red"}}
                           placeholder={placeholder} value={value}
                           onBlur={this.apply}
                           onChange={this.onChange}/>
                    <i className={"fa fa-refresh fa-spin fa-fw " + (fetching && "fetching")}/>
                </div>
                <div className="dropdown-menu" ref={this.dropdownMenuRef}>
                    {suggestions.map(suggestion => (
                        <a key={suggestion.key} className="dropdown-item"
                           onClick={this.apply} href="#">{suggestion.value}</a>
                    ))}
                </div>
            </div>
        );
    }

}

export default Autosuggest;