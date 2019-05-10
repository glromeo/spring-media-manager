import React, {Fragment, useEffect, useState} from "react";

export function AsyncStory({storyFn}) {
    const [state, setState] = useState({
        story: <div>Loading...</div>
    });
    useEffect(() => {
        Promise.resolve(storyFn()).then(story => setState({story}));
    }, [storyFn]);
    return (
        <Fragment>{state.story}</Fragment>
    );
}

export const withAsync = storyFn => <AsyncStory storyFn={storyFn}/>;