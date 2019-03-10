import React, {Component} from "react";
import ReactResizeDetector from 'react-resize-detector';
import "./Header.scss"
import {fetchConfiguration} from "../../ui/src/redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";

const INITIAL_HEIGHT = 2 / 3 * (9 / 16 * 100) + "vw";

class Header extends Component {

    constructor(props, context) {
        super(props, context);
        this.headerRef = React.createRef();
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
                this.props.onResize({
                    width,
                    height,
                    paddingTop: this.props.fixed ? this.videoHeight() : INITIAL_HEIGHT
                });
                this.pendingAnimation = false;
            });
        }
    }

    maxHeight() {
        const {imageWidth, imageHeight} = this.props;
        const width = window.innerWidth;
        return imageHeight && imageWidth ? width / imageWidth * imageHeight : INITIAL_HEIGHT;
    }

    videoHeight() {
        return this.headerRef.current.querySelector("video").clientHeight + 20;
    }


    render() {
        const {baseHeight = INITIAL_HEIGHT, fixed, children, scrollTop = 0} = this.props;
        const maxHeight = fixed ? this.maxHeight() : `calc(${baseHeight} - ${scrollTop}px)`;
        let className = ["Header"];
        if (scrollTop) {
            className.push("scrolling");
        }
        const { pathname } = this.props.location;
        if (pathname.length > 1) {
            className.push(pathname.split("/")[1]);
        }
        return (
            <div ref={this.headerRef} className={className.join(" ")} style={{maxHeight}}>
                {children({maxHeight})}
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}/>
            </div>
        );
    }
}

function calculateFixedHeight(metadata) {
    return {
        imageWidth: metadata ? metadata.imageWidth : window.innerWidth,
        imageHeight: metadata ? metadata.imageHeight : window.innerHeight
    };
}

export default withRouter(connect(state => {
    const {media} = state.playback;
    return media ? {
        fixed: true,
        ...calculateFixedHeight(media.metadata),
    } : {
        fixed: false,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
    };
})(Header));