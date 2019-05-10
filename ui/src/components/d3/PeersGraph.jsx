import React from "react";
import ReactResizeDetector from 'react-resize-detector';
import ForceLayout from "./ForceLayout";

/** @namespace peer.inetSocketAddress */

const {PI, cos, sin} = Math;
const localhost = {name: "localhost", group: 0, fixed: true, index: 0};

export default class PeersGraph extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.localhost = {...localhost};
        this.nodes = [this.localhost];
        this.links = [];
    }

    render() {
        const {peers} = this.props;

        const peersMap = {};
        let totalDownloaded = 0, totalUploaded = 0;
        for (const peer of peers) {
            peersMap[peer.inetSocketAddress] = peer;
            totalDownloaded += peer.downloaded || 0;
            totalUploaded += peer.uploaded || 0;
        }

        const nodes = [this.localhost], links = [];

        this.nodes.forEach((node, index) => {
            const peer = peersMap[node.name];
            if (peer) {
                node.downloaded = totalDownloaded ? peer.downloaded / totalDownloaded : 0;
                node.uploaded = totalUploaded ? peer.uploaded / totalUploaded : 0;
                nodes.push(node);
                links.push(this.links[index - 1]);
                peersMap[node.name] = undefined;
            }
        });
        for (const peer of Object.values(peersMap)) if (peer) {
            const node = {
                name: peer.inetSocketAddress,
                downloaded: totalDownloaded ? peer.downloaded / totalDownloaded : 0,
                uploaded: totalUploaded ? peer.uploaded / totalUploaded : 0,
                group: 1
            };
            nodes.push(node)
            links.push({source: this.localhost, target: node})
        }

        return (
            <div className="PeersGraph" style={{width: "100%", height: "100%"}}>
                <ReactResizeDetector handleWidth handleHeight>
                    {(width = 0, height = 0) => {

                        const x0 = this.localhost.fx = width / 2;
                        const y0 = this.localhost.fy = height / 2;

                        const s = 2 * PI / (nodes.length - 1);
                        for (let n = 1; n < nodes.length; n++) {
                            const node = nodes[n];
                            if (!node.hasOwnProperty('index')) {
                                node.x = x0 + 200 * cos(n * s);
                                node.y = y0 + 200 * sin(n * s);
                                node.vx = node.vy = 0;
                            }
                        }

                        return (
                            <ForceLayout width={width} height={height} graph={{nodes, links}}/>
                        )
                    }}
                </ReactResizeDetector>
            </div>
        )
    }
}