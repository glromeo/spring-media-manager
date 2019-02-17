import React from "react";
import {storiesOf} from "@storybook/react";

import Dropdown from "../components/Dropdown";

storiesOf('Dropdown', module)
    .add('simple', () => (
        <div style={{padding: 20}}>
            <Dropdown>Simple</Dropdown>
        </div>
    ));
