/** @jsx h */
import { h } from 'preact';
import {useState} from "preact/hooks";
import {action, actions} from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import 'preact-material-components/Button/style.css';
import Button from 'preact-material-components/Button';

export default {
    title: 'Hooks',
    decorators: [withKnobs]
};

export const StatefulButton = () => {

    const buttonActions = actions({ onMouseEnter: 'enter', onMouseLeave: 'leave' });

    function StatefulButton() {
        const [count, setCount] = useState(number("initial count", 0));
        return <Button {...buttonActions} onClick={()=>setCount(count+1)}>{count === 0 ? "Click Me!": `Clicked ${count} Times`}</Button>
    }
    return <StatefulButton/>;
};
