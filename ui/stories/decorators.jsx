import React, {useEffect, useState} from "react";

export function AsyncStory({storyFn}) {
    const [state, setState] = useState({
        story: <div>Loading...</div>
    });
    useEffect(() => {
        Promise.resolve(storyFn()).then(story => setState({story}));
    }, [storyFn]);
    return (
        <div style={{width: '100%', height: '100%', padding: 100}}>
            {state.story}
        </div>
    );
}

export const withLazyStory = storyFn => <AsyncStory storyFn={storyFn}/>;