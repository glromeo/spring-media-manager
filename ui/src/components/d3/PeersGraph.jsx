import React, {useEffect, useState} from "react";
import ReactResizeDetector from 'react-resize-detector';
import ForceLayout from "./ForceLayout";

const LOCALHOST = {name: "127.0.0.1", group: 0, speed: 0};

export default function PeersGraph({peers}) {

    const [nodes, setNodes] = useState([LOCALHOST]);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const nodes = [LOCALHOST];
        const links = [];
        peers.forEach((peer, index) => {
            const node = {
                name: peer.inetSocketAddress,
                group: 1,
                speed: 0
            };
            nodes.push(node);
            links.push({source: LOCALHOST, target: node});
        });
        setNodes(nodes);
        setLinks(links);
    }, [peers]);

    return (
        <div className="PeersGraph" style={{width: "100%", height: "100%"}}>
            <ReactResizeDetector handleWidth handleHeight>
                {(width, height) => {
                    LOCALHOST.fx = width / 2;
                    LOCALHOST.fy = height / 2;
                    return <ForceLayout width={width} height={height} nodes={nodes} links={links}/>;
                }}
            </ReactResizeDetector>
        </div>
    )
}