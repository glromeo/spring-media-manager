import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import SockJsClient from "react-stomp";

import ProgressBar from "../src/components/ProgressBar";
import PeersGraph from "../src/components/d3/PeersGraph";

import {HTTP_HEADERS} from "../src/util/constants";

storiesOf('Download', module)

    .add('TODO: progress bar', () => {

        function StompStory() {

            const [value, setValue] = useState(0);
            const clientRef = useRef();

            useEffect(() => {
                setTimeout(() => {
                    const client = clientRef.current;
                    client.sendMessage('/app/progress', JSON.stringify({
                        operation: "hello progress"
                    }));
                }, 1000);
            }, []);

            return (
                <div className="StompStory">
                    <ProgressBar value={value} total={100}/>
                    <SockJsClient ref={clientRef} url='http://localhost:8080/api/socket'
                                  topics={['/topic/progress']}
                                  onMessage={(message) => {
                                      setValue(message.value);
                                  }}/>
                </div>
            )
        }

        return <div style={{padding: 20}}><StompStory/></div>
    })

    .add('download', () => {

        function postMagnetDownload(action, magnetUri) {
            return fetch(`/api/download/magnet?action=${action}&keepSeeding=false`, {
                method: "POST",
                headers: {
                    ...HTTP_HEADERS,
                    "Content-Type": "text/plain"
                },
                body: magnetUri
            }).then(response => {
                if (!response.ok) {
                    throw Error(response.status + " - " + response.statusText);
                }
            })
        }

        const IDLE = "primary";
        const RUNNING = "success";
        const STOPPED = "danger";

        function Download(params) {

            const [magnetUri, setMagnetUri] = useState(params.magnetUri);
            const [session, setSession] = useState({state: IDLE});
            const [peers, setPeers] = useState([]);

            function startDownload() {
                setSession({
                    startedAt: new Date(),
                    magnetUri: magnetUri
                });
                postMagnetDownload("start", magnetUri).then(() => {
                    setSession({...session, state: RUNNING});
                }).catch(e => {
                    setSession({...session, state: STOPPED, failure: e.message});
                })
            }

            function stopDownload() {
                postMagnetDownload("stop", magnetUri).then(() => {
                    setSession({...session, state: IDLE});
                }).catch(e => {
                    setSession({...session, state: STOPPED, failure: e.message});
                })
            }

            return (
                <div className="Download">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Magnet URI" aria-label="Magnet URI"
                               value={magnetUri}
                               onChange={e => setMagnetUri(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button className={"btn btn-outline-" + session.state} type="button" onClick={startDownload}
                                    disabled={session.state === RUNNING}>
                                Download
                            </button>
                            <button className="btn btn-outline-danger" type="button" onClick={stopDownload}
                                    disabled={session.state === IDLE}>
                                Stop
                            </button>
                        </div>
                    </div>
                    {session.state === STOPPED && (
                        <div className="mb-3">
                            <div className="alert alert-danger" role="alert">
                                {session.failure}
                            </div>
                        </div>
                    )}
                    <div style={{width: 800, height: 800}}>
                        <PeersGraph peers={peers}/>
                    </div>
                    <ProgressBar value={0} total={100}/>
                    <SockJsClient url='http://localhost:8080/api/socket'
                                  topics={['/topic/download']}
                                  onMessage={(message) => {
                                      console.log(message);
                                      if (message.peers) {
                                          if (session.state !== RUNNING) {
                                              setSession({...session, state: RUNNING});
                                          }
                                          setPeers(message.peers);
                                      }
                                  }}/>
                </div>
            )
        }

        return <div style={{padding: 20}}><Download
            magnetUri={"magnet:?xt=urn:btih:c4232f87b067ec9befde48a0e8cdeb4831a15bef&dn=Spider-Man.Into.the.Spider-Verse.2018.1080p.WEB-DL.DD5.1.H264-FGT&tr=http%3A%2F%2Ftracker.trackerfix.com%3A80%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710&tr=udp%3A%2F%2F9.rarbg.to%3A2710"}/>
        </div>;
    })

