import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import Curtain from "./sandbox/Curtain";
import List from "../src/components/virtualized/List";
import Header from "../src/App";
import SearchPane from "../src/containers/SearchPane";
import {Provider} from "react-redux";
import configureStore from "../src/redux/store";

storiesOf("Curtain", module)

    .add("curtain component (abandoned)", () => {

        function Story() {

            const [scrollTop, setScrollTop] = useState(0);

            function Header({color, width, height}) {
                console.log("header", color, width, height)
                return (
                    <div style={{width: width, height: Math.max(48, height - scrollTop), backgroundColor: color, padding: 10}}>
                        Width: {width} - Height: {height} - scrollTop: {scrollTop}
                    </div>
                )
            }

            const renderItem = (height, index) => {
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
            };

            const itemSize = index => index === 0 ? 500 : 250;
            const itemCount = 50;
            return (
                <Curtain component={({width, height}) => (<Header color={"red"} width={width} height={height}/>)}
                         aspect="16:9">
                    {({height, paddingTop, onResize}) => (
                        <List height={height}
                              paddingTop={paddingTop}
                              onResize={onResize}
                              onScroll={({scrollTop})=>setScrollTop(scrollTop)}
                              itemCount={itemCount}
                              itemSize={itemSize}
                              renderItem={renderItem}/>
                    )}
                </Curtain>
            )

        }

        return <Story/>
    })

    .add("movie list", () => {

        function Header({width}) {
            console.log("rendering header", width, width * 9 / 16);
            return (
                <SearchPane key={"header"} height={width * 9 / 16}/>
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

        const itemSize = index => index === 0 ? window.innerWidth * 9 / 16 : 250;
        const itemCount = 50 + 1;

        function useWindowResizeEvent(resizeCallback) {
            useEffect(() => {
                window.addEventListener("resize", resizeCallback);
                return () => {
                    window.removeEventListener("resize", resizeCallback);
                }
            }, []);
        }

        function MediaList({editable, header}) {

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

            // console.log("rendering media list", width, height);

            return (
                <List apiRef={listRef}
                      height={height}
                      itemCount={itemCount}
                      itemSize={itemSize}
                      override={{0: height => header({width, height})}}
                      renderItem={renderItem}
                />
            )
        }

        return (
            <Provider store={configureStore()}>
                <MediaList header={Header} editable={false}/>
            </Provider>
        )
    })
