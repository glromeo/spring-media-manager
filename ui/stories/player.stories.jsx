import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {Player} from "video-react";
import {number, text} from "@storybook/addon-knobs";
import configureStore from "../src/redux/store";
import {connect, Provider} from "react-redux";

import "video-react/dist/video-react.css";
import {HTTP_HEADERS} from "../src/util/constants";
import {Details} from "../src/media/movie/Details";

storiesOf("Player", module)

    .add("video react", () => {


    })

    .add("fading poster image", () => {

        const ConnectedCard = connect((state, {searchText}) => {
            return searchText === state.search.text ? {
                media: state.media.visible[0]
            } : {}
        })(Details);

        const store = configureStore();
        const searchText = text("searchText", "Return of the Jedi");
        store.dispatch(fetchMediaIfNeeded(searchText));
        return (
            <Provider store={store}>
                <ConnectedCard searchText={searchText}/>
            </Provider>
        )
    })

    .add("movie palette", () => {

        function Y([R, G, B]) {
            return 0.299 * R + 0.587 * G + 0.114 * B;
        }

        function Palette({movieId, size}) {
            const [palette, setPalette] = useState([]);
            useEffect(() => {
                fetch(`/api/poster/${movieId}/palette?size=${size}`, {headers: HTTP_HEADERS})
                    .then(res => res.json())
                    .then(palette => palette.sort((p1, p2) => Y(p1) - Y(p2)))
                    .then(setPalette)
            }, []);
            const width = (window.innerWidth - 100) / palette.length;
            const height = Math.min(width, window.innerHeight / 8);

            const colors = palette.map(([R, G, B]) => `rgb(${R},${G},${B})`);

            const backgroundImage = `linear-gradient(to bottom, ${colors[Math.ceil(colors.length / 2 + 1)]}, ${colors[Math.floor(colors.length / 2)]})`;

            console.log("backgroundImage", backgroundImage);

            return (
                <div className="d-flex flex-column" style={{width: window.innerWidth, padding: 50}}>
                    <div className="Poster" style={{
                        backgroundImage: `url(/api/poster/${movieId}/large)`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        width: window.innerHeight / 3,
                        height: window.innerHeight / 2
                    }}/>
                    <div style={{height: height}}/>
                    <div className="d-flex">
                        {colors.map((color, i) => (
                            <div key={i} className="flex-fill" style={{width, height, backgroundColor: color}}/>
                        ))}
                    </div>
                    <div style={{
                        backgroundImage: backgroundImage,
                        height: height
                    }}/>
                </div>
            )
        }

        return <Palette movieId={number("movieId", 1892)}
                        size={
                            number("size", 8, {range: true, min: 1, max: 16, step: 1})
                        }/>
    })