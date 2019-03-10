import React from "react";
import {storiesOf} from "@storybook/react";
import ShadowDOM from 'react-shadow';

import "font-awesome/css/font-awesome.min.css";

storiesOf('Font Awesome', module)

    .add('spinner 4.7', () => (
        <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
        </div>
    ))

    .add('spinner 5.7', () => (
        <ShadowDOM include={['https://use.fontawesome.com/releases/v5.7.2/css/all.css']}>
            <div>
                <i className="fas fa-spinner"/>
            </div>
        </ShadowDOM>
    ))
