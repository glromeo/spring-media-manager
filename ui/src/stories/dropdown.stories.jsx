import React from "react";
import {storiesOf} from "@storybook/react";

import Dropdown from "../components/Dropdown";

storiesOf('Dropdown', module)
    .add('simple', () => (
        <div style={{padding: 20, width: 500, backgroundColor: 'lightgrey'}}>
            <Dropdown>Simple</Dropdown>
        </div>
    ));
