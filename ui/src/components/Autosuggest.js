import React, {Component} from 'react';
import "./Autosuggest.scss";

class Autosuggest extends Component {

    constructor(props, context) {
        super(props, context);
        const {
            defaultKey,
            defaultValue,
            suggestions
        } = this.props;
        this.state = {
            key: defaultKey,
            value: defaultValue,
            suggestions: suggestions
        }
    }

    inputRef = React.createRef();
    dropdownMenuRef = React.createRef();

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.suggestions !== this.props.suggestions) {
            clearTimeout(this.pendingChangeTimeout);
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

    onInput = () => {
        const value = this.inputRef.current.innerText;
        if (!this.state.fetching) {
            this.setState({
                suggestions: this.filterSuggestions(this.state.suggestions, value),
                fetching: true
            });
            if (this.props.onChange) {
                clearTimeout(this.onChangeTimeout);
                this.onChangeTimeout = setTimeout(() => {
                    this.props.onChange({value});
                }, 1000);
            }
            this.pendingChangeTimeout = setTimeout(() => {
                if (this.state.fetching) {
                    this.setState({timeout: true});
                }
            }, 120 * 1000);
        }
    };

    onApply = ({key, value}) => {
        this.setState({key, value});
        if (this.props.onApply) {
            clearTimeout(this.onApplyTimeout);
            this.onApplyTimeout = setTimeout(() => this.props.onApply({key, value}), 100);
        }
    };

    render() {
        const {placeholder, style} = this.props;
        const {key, value, fetching, suggestions, timeout} = this.state;
        const isValid = !!key;
        return (
            <div className="dropdown" style={style}>
                <div className="form-group m-0" data-toggle="dropdown">
                    <p className="form-control" ref={this.inputRef} contentEditable
                       suppressContentEditableWarning
                       style={{borderColor: isValid ? undefined : "red"}}
                       onBlur={event => {
                           const value = this.inputRef.current.innerText;
                           this.onApply({value})
                       }}
                       onInput={this.onInput}>
                        {value || <i style={{opacity: 0.5}}>{placeholder}</i>}
                    </p>
                    {!timeout
                        ? <i className={"fa fa-refresh fa-spin fa-fw " + (fetching && "fetching")}/>
                        : <i className="fa fa-exclamation-triangle" onClick={event => {
                            return this.setState({timeout: false, fetching: false});
                        }}/>
                    }
                </div>
                <div className="dropdown-menu" ref={this.dropdownMenuRef}>
                    {suggestions.map(suggestion => (
                        <a key={suggestion.key} className="dropdown-item d-flex"
                           onClick={event => {
                               this.onApply(suggestion);
                               event.preventDefault();
                           }} href={suggestion.key}>
                            <span style={{flex: "1 1 auto"}}>{suggestion.value}</span>
                            {suggestion.suffix && <span style={{marginLeft: 20, opacity: 0.75}}>{suggestion.suffix}</span>}
                        </a>
                    ))}
                </div>
            </div>
        );
    }

}

export default Autosuggest;