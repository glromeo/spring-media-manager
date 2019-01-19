import React, {Component} from "react";
import ReactResizeDetector from 'react-resize-detector';
import "./Header.scss"
import {fetchConfiguration} from "./redux/actions";
import {connect} from "react-redux";

class Header extends Component {

    constructor(props, context) {
        super(props, context);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchConfiguration());
    }

    onResize(width, height) {
        if (!this.pendingAnimation) {
            this.pendingAnimation = true;
            requestAnimationFrame(time => {
                this.props.onResize({width, height});
                this.pendingAnimation = false;
            });
        }
    }

    render() {
        const {children, scrollTop = 0} = this.props;
        const maxHeight = `calc(50vh - ${scrollTop}px)`;
        return (
            <div className={(scrollTop === 0 ? "Header" : "Header scrolling")} style={{maxHeight}}>
                {children({maxHeight})}
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}/>
            </div>
        );
    }
}

export default connect()(Header);