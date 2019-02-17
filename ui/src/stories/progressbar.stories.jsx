import React, {useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import SockJsClient from "react-stomp";

import ProgressBar from "../components/ProgressBar";

let initialized = false;

function StompStory() {

    const [value, setValue] = useState(0);
    const clientRef = useRef();

    if (!initialized) {
        initialized = true;
        setTimeout(() => {
            const client = clientRef.current;
            client.sendMessage('/app/progress', JSON.stringify({
                operation: "hello progress"
            }));
        }, 1000);
    }

    return <div style={{padding: 20}}>
        <ProgressBar value={value} total={100}/>
        <SockJsClient ref={clientRef} url='http://localhost:8080/api/socket'
                      topics={['/topic/progress']}
                      onMessage={(message) => {setValue(message.value);}}/>
    </div>;
}

storiesOf('Progress Bar', module)
    .add('simple', () => (
        <div style={{padding: 20}}>
            <ProgressBar value={10} total={100}/>
        </div>
    ))
    .add('stomp', () => <StompStory/>);
