import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import {List} from "../src/components/virtualized/List";
import {SearchPanel} from "../src/search/SearchPanel";
import {Provider} from "react-redux";
import configureStore from "../src/redux/store";
import {boolean, number, text} from "@storybook/addon-knobs";

import {selectMedia} from "../src/redux/actions";
import Card from "../src/media/Card";
import {Media} from "../src/media/Media";
import {BrowserRouter as Router} from 'react-router-dom';
import {action} from "@storybook/addon-actions";

import "../src/App.scss";

storiesOf("Application", module)

    .add("sticky header", () => {

        function Header({width, height, scrollTop}) {
            console.log("rendering header", width, height);
            return (
                <div className="d-flex flex-column" style={{
                    height: Math.min(window.innerHeight / 2, window.innerWidth / 2.49),
                    backgroundColor: "red",
                    color: "white",
                    position: "sticky",
                    top: 0
                }}>
                    <div style={{margin: "auto", marginBottom: 0}}>
                        Width: {width} - Height: {height} - ScrollTop: {scrollTop.toFixed(2)}
                    </div>
                </div>
            )
        }

        function renderItem(height, index) {
            console.log("outer rendering", height, index);
            return (
                <div key={index} data-row={index}
                     style={{
                         height,
                         backgroundColor: "white",
                         padding: 10
                     }}>
                    <div style={{
                        height: "100%",
                        backgroundColor: index % 2 ? "green" : "blue",
                        padding: 80,
                        fontSize: "3em",
                        color: "white"
                    }}>
                        Row {index}
                    </div>
                </div>
            );
        }

        const itemSize = index => index === 0 ? Math.min(window.innerHeight / 2, window.innerWidth * 9 / 16) : 250;
        const itemCount = 50 + 1;

        function useWindowResizeEvent(resizeCallback) {
            useEffect(() => {
                window.addEventListener("resize", resizeCallback);
                return () => {
                    window.removeEventListener("resize", resizeCallback);
                }
            }, []);
        }

        function MediaList({header}) {

            const [{width, height}, setDimensions] = useState({
                width: window.innerWidth,
                height: window.innerHeight
            });

            const listRef = useRef();

            useWindowResizeEvent(function () {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
                listRef.current.redraw(0);
            });

            console.log("rendering media list", width, height);

            return (
                <List apiRef={listRef}
                      height={height}
                      itemCount={itemCount}
                      itemSize={itemSize}
                      renderItem={renderItem}>
                    {scrollTop => header({width, height, scrollTop})}
                </List>
            )
        }

        return (
            <Provider store={configureStore()}>
                <MediaList header={Header}/>
            </Provider>
        )
    })

    .add("search pane", () => {

        function Header({width, height, scrollTop}) {
            const topHeight = width * 9 / 16;
            return (
                <div className={"Header" + (scrollTop > 0 ? " scrolling" : "")}
                     style={{top: 68 - topHeight}}>
                    <SearchPanel
                        height={number("height", 500, {
                            range: true,
                            min: 0,
                            max: 1000,
                            step: 1,
                        })}
                        scrollTop={number("scrollTop", 0, {
                            range: true,
                            min: 0,
                            max: 500,
                            step: 1,
                        })}/>
                </div>
            )
        }

        const Story = () => (
            <Provider store={configureStore()}>
                <Router>
                    <div style={{backgroundColor: "white", width: "100%", height: "100%"}}>
                        <Header width={window.innerWidth}/>
                    </div>
                </Router>
            </Provider>
        );

        return <Story/>
    })

    .add("genre icons", () => {

        function GenreIcon({genre}) {
            return <div className="Genre">
                <div className={`Icon ${genre}`}/>
            </div>
        }

        return (
            <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto auto"}}>
                <div><GenreIcon genre="Horror"/></div>
                <div><GenreIcon genre="Music"/></div>
                <div><GenreIcon genre="Fantasy"/></div>
                <div><GenreIcon genre="Crime"/></div>
                <div><GenreIcon genre="Comedy"/></div>
                <div><GenreIcon genre="Documentary"/></div>
                <div><GenreIcon genre="Science_Fiction"/></div>
                <div><GenreIcon genre="Animation"/></div>
                <div><GenreIcon genre="Western"/></div>
                <div><GenreIcon genre="War"/></div>
                <div><GenreIcon genre="Thriller"/></div>
                <div><GenreIcon genre="History"/></div>
                <div><GenreIcon genre="Action"/></div>
                <div><GenreIcon genre="TV_Movie"/></div>
                <div><GenreIcon genre="Drama"/></div>
                <div><GenreIcon genre="Karaoke"/></div>
                <div><GenreIcon genre="Adventure"/></div>
                <div><GenreIcon genre="Romance"/></div>
                <div><GenreIcon genre="Family"/></div>
                <div><GenreIcon genre="Mystery"/></div>
            </div>
        )
    })

    .add("media list", () => {

        const Story = () => (
            <Provider store={configureStore()}>
                <Router>
                    <Media isFetching={boolean("fetching", false)} edit={boolean("edit", false)}/>
                </Router>
            </Provider>
        )

        return <Story/>
    })

    .add("media card", () => {

        const media = [
            {
                "path": "V:\\A Pigeon Sat on a Branch Reflecting on Existence (2014)\\A Pigeon Sat on a Branch Reflecting on Existence (2014) h264-1080p AAC-6ch.mkv",
                "movie": {
                    "poster_path": "/wxa4VxJkGcuYNTEOfa04eHMtolL.jpg",
                    "adult": false,
                    "overview": "An absurdist, surrealistic and shocking pitch-black comedy, which moves freely from nightmare to fantasy to hilariously deadpan humour as it muses on man’s perpetual inhumanity to man.",
                    "release_date": "2014-10-24",
                    "genre_ids": [18, 35],
                    "id": 110390,
                    "original_title": "En duva satt på en gren och funderade på tillvaron",
                    "original_language": "sv",
                    "title": "A Pigeon Sat on a Branch Reflecting on Existence",
                    "backdrop_path": "/ezLSL6nVu2jr3sZ197XrjEdOWLR.jpg",
                    "popularity": 6.795,
                    "vote_count": 185,
                    "video": false,
                    "vote_average": 6.9
                },
                "metadata": {
                    "exifToolVersionNumber": "11.23",
                    "fileName": "A Pigeon Sat on a Branch Reflecting on Existence (2014) h264-1080p AAC-6ch.mkv",
                    "directory": "V:/A Pigeon Sat on a Branch Reflecting on Existence (2014)",
                    "fileSize": "2.8 GB",
                    "fileModificationDateTime": "2016-06-12T22:19:06",
                    "fileAccessDateTime": "2019-01-05T18:45:32",
                    "fileCreationDateTime": "2018-11-22T21:10:47",
                    "filePermissions": "rw-rw-rw-",
                    "fileType": "MKV",
                    "fileTypeExtension": "mkv",
                    "mimeType": "video/x-matroska",
                    "majorBrand": null,
                    "minorVersion": null,
                    "compatibleBrands": null,
                    "movieHeaderVersion": null,
                    "createDate": null,
                    "modifyDate": null,
                    "timeScale": null,
                    "duration": "1:40:02",
                    "preferredRate": null,
                    "preferredVolume": null,
                    "previewTime": null,
                    "previewDuration": null,
                    "posterTime": null,
                    "selectionTime": null,
                    "selectionDuration": null,
                    "currentTime": null,
                    "nextTrackID": null,
                    "trackHeaderVersion": null,
                    "trackCreateDate": null,
                    "trackModifyDate": null,
                    "trackID": null,
                    "trackDuration": null,
                    "trackLayer": null,
                    "trackVolume": null,
                    "imageWidth": 1920,
                    "imageHeight": 1080,
                    "graphicsMode": null,
                    "opColor": null,
                    "compressorID": null,
                    "sourceImageWidth": null,
                    "sourceImageHeight": null,
                    "xResolution": null,
                    "yResolution": null,
                    "bitDepth": null,
                    "pixelAspectRatio": null,
                    "videoFrameRate": 24,
                    "matrixStructure": null,
                    "mediaHeaderVersion": null,
                    "mediaCreateDate": null,
                    "mediaModifyDate": null,
                    "mediaTimeScale": null,
                    "mediaDuration": null,
                    "mediaLanguageCode": null,
                    "handlerDescription": null,
                    "balance": null,
                    "audioFormat": null,
                    "audioChannels": "6",
                    "audioBitsPer": null,
                    "audioSampleRate": "48000",
                    "handlerType": null,
                    "handlerVendorId": null,
                    "encoder": null,
                    "movieDataSize": null,
                    "movieDataOffset": null,
                    "avgBitrate": null,
                    "imageSize": "1920x1080",
                    "megapixels": "2.1",
                    "rotation": null
                },
                "color": [169, 195, 230]
            },
            {
                "path": "V:\\Automata.2014.DVDRip.Aac.Ita.Eng.x264-lizaliza.mkv",
                "movie": null,
                "metadata": {
                    "exifToolVersionNumber": "11.23",
                    "fileName": "Automata.2014.DVDRip.Aac.Ita.Eng.x264-lizaliza.mkv",
                    "directory": "V:/",
                    "fileSize": "1849 MB",
                    "fileModificationDateTime": "2018-11-17T03:36:53",
                    "fileAccessDateTime": "2019-01-05T18:45:33",
                    "fileCreationDateTime": "2018-11-22T21:07:13",
                    "filePermissions": "rw-rw-rw-",
                    "fileType": "MKV",
                    "fileTypeExtension": "mkv",
                    "mimeType": "video/x-matroska",
                    "majorBrand": null,
                    "minorVersion": null,
                    "compatibleBrands": null,
                    "movieHeaderVersion": null,
                    "createDate": null,
                    "modifyDate": null,
                    "timeScale": null,
                    "duration": "1:45:39",
                    "preferredRate": null,
                    "preferredVolume": null,
                    "previewTime": null,
                    "previewDuration": null,
                    "posterTime": null,
                    "selectionTime": null,
                    "selectionDuration": null,
                    "currentTime": null,
                    "nextTrackID": null,
                    "trackHeaderVersion": null,
                    "trackCreateDate": null,
                    "trackModifyDate": null,
                    "trackID": null,
                    "trackDuration": null,
                    "trackLayer": null,
                    "trackVolume": null,
                    "imageWidth": 720,
                    "imageHeight": 430,
                    "graphicsMode": null,
                    "opColor": null,
                    "compressorID": null,
                    "sourceImageWidth": null,
                    "sourceImageHeight": null,
                    "xResolution": null,
                    "yResolution": null,
                    "bitDepth": null,
                    "pixelAspectRatio": null,
                    "videoFrameRate": 25,
                    "matrixStructure": null,
                    "mediaHeaderVersion": null,
                    "mediaCreateDate": null,
                    "mediaModifyDate": null,
                    "mediaTimeScale": null,
                    "mediaDuration": null,
                    "mediaLanguageCode": null,
                    "handlerDescription": null,
                    "balance": null,
                    "audioFormat": null,
                    "audioChannels": "6",
                    "audioBitsPer": null,
                    "audioSampleRate": "48000",
                    "handlerType": null,
                    "handlerVendorId": null,
                    "encoder": null,
                    "movieDataSize": null,
                    "movieDataOffset": null,
                    "avgBitrate": null,
                    "imageSize": "720x430",
                    "megapixels": "0.310",
                    "rotation": null
                },
                "color": null
            },
            {
                "path": "V:\\Another Earth (2011)\\Another Earth (2011) h264-720p AAC-2ch.mp4",
                "movie": {
                    "poster_path": "/qvGJK3lFzpifAdyIupMNdWNX0qr.jpg",
                    "adult": false,
                    "overview": "On the night of the discovery of a duplicate Earth in the Solar system, an ambitious young student and an accomplished composer cross paths in a tragic accident.",
                    "release_date": "2011-07-22",
                    "genre_ids": [18, 878],
                    "id": 55420,
                    "original_title": "Another Earth",
                    "original_language": "en",
                    "title": "Another Earth",
                    "backdrop_path": "/fJfpZnS2pvFCtyaDqoIgKLASvAT.jpg",
                    "popularity": 7.002,
                    "vote_count": 787,
                    "video": false,
                    "vote_average": 6.7
                },
                "metadata": {
                    "exifToolVersionNumber": "11.23",
                    "fileName": "Another Earth (2011) h264-720p AAC-2ch.mp4",
                    "directory": "V:/Another Earth (2011)",
                    "fileSize": "600 MB",
                    "fileModificationDateTime": "2015-09-19T07:13:50",
                    "fileAccessDateTime": "2019-01-05T18:45:33",
                    "fileCreationDateTime": "2018-11-22T21:11:20",
                    "filePermissions": "rw-rw-rw-",
                    "fileType": "MP4",
                    "fileTypeExtension": "mp4",
                    "mimeType": "video/mp4",
                    "majorBrand": "MP4  Base Media v1 [IS0 14496-12:2003]",
                    "minorVersion": "0.0.1",
                    "compatibleBrands": "isom, avc1",
                    "movieHeaderVersion": "0",
                    "createDate": "2011-10-31T03:44:34",
                    "modifyDate": "2011-10-31T03:44:34",
                    "timeScale": 600,
                    "duration": "1:32:26",
                    "preferredRate": "1",
                    "preferredVolume": "100.00%",
                    "previewTime": "0 s",
                    "previewDuration": "0 s",
                    "posterTime": "0 s",
                    "selectionTime": "0 s",
                    "selectionDuration": "0 s",
                    "currentTime": "0 s",
                    "nextTrackID": "3",
                    "trackHeaderVersion": "0",
                    "trackCreateDate": "2011-10-31T03:44:34",
                    "trackModifyDate": "2011-10-31T03:46:25",
                    "trackID": "1",
                    "trackDuration": "PT1H32M25S",
                    "trackLayer": "0",
                    "trackVolume": "0.00%",
                    "imageWidth": 1280,
                    "imageHeight": 692,
                    "graphicsMode": "srcCopy",
                    "opColor": "0 0 0",
                    "compressorID": "avc1",
                    "sourceImageWidth": 1280,
                    "sourceImageHeight": 692,
                    "xResolution": 72,
                    "yResolution": 72,
                    "bitDepth": 24,
                    "pixelAspectRatio": null,
                    "videoFrameRate": 23.976,
                    "matrixStructure": "1 0 0 0 1 0 0 0 1",
                    "mediaHeaderVersion": "0",
                    "mediaCreateDate": "2011-10-31T03:46:22",
                    "mediaModifyDate": "2011-10-31T03:46:24",
                    "mediaTimeScale": 24000,
                    "mediaDuration": "PT1H32M26S",
                    "mediaLanguageCode": "und",
                    "handlerDescription": "GPAC ISO Audio Handler",
                    "balance": "0",
                    "audioFormat": "mp4a",
                    "audioChannels": "2",
                    "audioBitsPer": "16",
                    "audioSampleRate": "24000",
                    "handlerType": "Audio Track",
                    "handlerVendorId": null,
                    "encoder": null,
                    "movieDataSize": "627214747",
                    "movieDataOffset": "2070804",
                    "avgBitrate": "905 kbps",
                    "imageSize": "1280x692",
                    "megapixels": "0.886",
                    "rotation": "0"
                },
                "color": [1, 81, 134]
            }
        ];

        media.filter(m => m.color).forEach(m => {
            const [R, G, B] = m.color;
            m.color = `rgba(${R}, ${G}, ${B}, 0.33)`;
        })

        const height = 180;

        const Story = () => (
            <Provider store={configureStore()}>
                <Router>
                    <div>
                        <div style={{height}}>
                            <div key={1} data-row={1}
                                 className={boolean("selected(1)") ? "selected" : ""}
                                 style={{height}}
                                 onClick={() => action("selectMedia")}>
                                <Card media={media[0]} searchWords={[text("searchWords(1)", "")]}
                                      edit={boolean("edit(1)")}
                                      onSave={media => {
                                          action("save")(media);
                                      }}/>
                            </div>
                        </div>
                        <div style={{height}}>
                            <div key={2} data-row={2}
                                 className={boolean("selected(2)") ? "selected" : ""}
                                 style={{height}}
                                 onClick={() => action("selectMedia")}>
                                <Card media={media[1]} searchWords={[text("searchWords(2)", "")]}
                                      edit={boolean("edit(2)")}
                                      onSave={media => {
                                          action("save")(media);
                                      }}/>
                            </div>
                        </div>
                        <div style={{height}}>
                            <div key={3} data-row={3}
                                 className={boolean("selected(3)") ? "selected" : ""}
                                 style={{height}}
                                 onClick={() => action("selectMedia")}>
                                <Card media={media[2]} searchWords={[text("searchWords(3)", "")]}
                                      edit={boolean("edit(3)")}
                                      onSave={media => {
                                          action("save")(media);
                                      }}/>
                            </div>
                        </div>
                    </div>
                </Router>
            </Provider>
        )

        return <Story/>
    })

    .add("home button", () => {

        const css = `
            .Home {
                position: absolute;
                left: 1em;
                top: 1em;
                width: 3.5em;
                height: 3.5em;
                border-radius: 2em;
                border-width: 2px;
                box-shadow: 3px 3px rgba(0,0,0,0.5);
            }
        `;

        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.innerText = css;
        document.head.appendChild(style);

        function Home({history}) {
            return (
                <button className="Home btn btn-danger text-white">
                    <svg data-icon="search" role="img" aria-hidden="true" viewBox="0 0 512 512"
                         onClick={() => history.back()}>
                        <path fill="currentColor"
                              d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"/>
                    </svg>
                </button>
            )
        }

        return (
            <div style={{width: 1200, height: 600, position: "relative", backgroundColor: "blue"}}>
                <Home history={{back: action("back")}}/>
            </div>
        )
    })