import React from "react";
import {storiesOf} from "@storybook/react";

import MediaPlayer from "../MediaPlayer";

storiesOf('MediaPlayer', module)
    .add('simple', () => (
        <div style={{padding: 20}}>
            <MediaPlayer match={{params:{id:110390}}}/>
        </div>
    ));
