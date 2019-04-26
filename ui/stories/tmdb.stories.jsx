import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {number} from "@storybook/addon-knobs";

const API_KEY = "150dc7265c37ec9e671958360d92dcf6";

storiesOf("tmdb", module)

    .add("backdrops", () => {

        function Backdrops({id, size, render}) {

            const [configuration, setConfiguration] = useState(null);

            useEffect(function () {

                fetch(`https://api.themoviedb.org/3/configuration?api_key=${API_KEY}`)
                    .then(response => response.json())
                    .then(setConfiguration)
                    .catch(console.error)

            }, []);

            const [images, setImages] = useState({});
            useEffect(function () {
                fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}`)
                    .then(response => response.json())
                    .then(setImages)
                    .catch(console.error)
            }, [id])

            if (!configuration) return (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )

            const {base_url, backdrop_sizes} = configuration.images;
            const {backdrops} = images;

            return (
                <div className="d-flex flex-column flex-fill" style={{height: "100vh", width: "100vw"}}>
                    {backdrops ? (
                        <div id="carouselExampleInterval" className="carousel slide" data-ride="carousel">
                            <div className="carousel-inner">
                                {backdrops.map((backdrop, index) => {
                                    const backdropUrl = `${base_url}${backdrop_sizes[size]}${backdrop.file_path}`;
                                    return (
                                        <div key={index} className={"carousel-item " + (!index && "active")}
                                             data-interval="10000">
                                            {typeof render === "function" ? render(backdrop) : render}
                                            <div className="d-block w-100" style={{
                                                height: "56.25vw",
                                                backgroundImage: `url(${backdropUrl})`,
                                                backgroundPosition: `center`,
                                                backgroundRepeat: `no-repeat`,
                                                backgroundSize: `cover`
                                            }}/>
                                        </div>
                                    )
                                })}
                            </div>
                            <a className="carousel-control-prev" href="#carouselExampleInterval" role="button"
                               data-slide="prev">
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleInterval" role="button"
                               data-slide="next">
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    ) : images ? (
                        <div className="alert alert-danger" role="alert">
                            No backdrops found for {id}
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            )
        }

        return <Backdrops id={number("movie id", 324857)}
                          render={backdrop => {
                              const {
                                  aspect_ratio, file_path, height, iso_639_1, vote_average, vote_count, width
                              } = backdrop;
                              return (
                                  <div className="d-flex flex-column flex-fill float-left mx-2"
                                       style={{fontSize: "1em", textShadow: "1px 1px 1px lightgray"}}>
                                      <div>aspect_ratio: {aspect_ratio}</div>
                                      <div>file_path: {file_path}</div>
                                      <div>height: {height}</div>
                                      <div>iso_639_1: {iso_639_1}</div>
                                      <div>vote_average: {vote_average}</div>
                                      <div>vote_count: {vote_count}</div>
                                      <div>width: {width}</div>
                                  </div>
                              )
                          }}
                          size={number("size", 3, {range: true, min: 0, max: 3, step: 1})}/>
    })