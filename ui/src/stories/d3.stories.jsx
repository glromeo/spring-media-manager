import React from "react";
import {storiesOf} from "@storybook/react";
import ReactResizeDetector from 'react-resize-detector';
import ForceLayout from "../components/d3/ForceLayout";

storiesOf('D3 v4', module)
    .add('simple force layout', () => (
        <div style={{padding: 20, height: "100vh"}}>
            <ReactResizeDetector handleWidth handleHeight>
                {(width, height) => <ForceLayout width={width} height={height}/>}
            </ReactResizeDetector>
        </div>
    ));
