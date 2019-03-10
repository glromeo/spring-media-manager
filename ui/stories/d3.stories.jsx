import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import ReactResizeDetector from 'react-resize-detector';
import ForceLayout from "../src/components/d3/ForceLayout";
import * as d3 from "d3";
import PeersGraph from "../src/components/d3/PeersGraph";

storiesOf('D3 v5', module)

    .add('simple force layout', function () {
        const nodes = [
            {name: "127.0.0.1", group: 0, fixed: true},
            {name: "74.111.127.59", group: 1},
            {name: "120.190.245.173", group: 1},
            {name: "255.92.45.93", group: 1},
            {name: "126.220.124.77", group: 1},
            {name: "99.198.110.20", group: 1},
            {name: "60.96.111.211", group: 1},
            {name: "141.107.60.90", group: 1},
            {name: "231.20.172.163", group: 1},
            {name: "60.198.14.95", group: 1},
            {name: "65.193.50.248", group: 1}
        ];
        const links = [
            {source: nodes[0], target: nodes[1]},
            {source: nodes[0], target: nodes[2]},
            {source: nodes[0], target: nodes[3]},
            {source: nodes[0], target: nodes[4]},
            {source: nodes[0], target: nodes[5]},
            {source: nodes[0], target: nodes[6]},
            {source: nodes[0], target: nodes[7]},
            {source: nodes[0], target: nodes[8]},
            {source: nodes[0], target: nodes[9]},
            {source: nodes[0], target: nodes[10]}
        ];
        return <div style={{padding: 20, height: "100vh"}}>
            <ReactResizeDetector handleWidth handleHeight>
                {(width, height) => {
                    if (width) nodes[0].fx = width / 2;
                    if (height) nodes[0].fy = height / 2;
                    return <ForceLayout width={width} height={height} graph={{nodes, links}}/>
                }}
            </ReactResizeDetector>
        </div>;
    })

    .add('incremental force layout', () => {

        const LOCALHOST = {name: "127.0.0.1", group: 0, fixed: true};
        const NODES = [
            {name: "74.111.127.59", group: 1},
            {name: "120.190.245.173", group: 1},
            {name: "255.92.45.93", group: 1},
            {name: "126.220.124.77", group: 1},
            {name: "99.198.110.20", group: 1},
            {name: "60.96.111.211", group: 1},
            {name: "141.107.60.90", group: 1},
            {name: "231.20.172.163", group: 1},
            {name: "60.198.14.95", group: 1},
            {name: "65.193.50.248", group: 1},
            {name: "174.111.127.59", group: 1},
            {name: "220.190.245.173", group: 1},
            {name: "245.92.45.93", group: 1},
            {name: "226.220.124.77", group: 1},
            {name: "199.198.110.20", group: 1},
            {name: "160.96.111.211", group: 1},
            {name: "241.107.60.90", group: 1},
            {name: "211.20.172.163", group: 1},
            {name: "160.198.14.95", group: 1},
            {name: "165.193.50.248", group: 1}
        ];

        function Story() {

            const [nodes, setNodes] = useState([LOCALHOST]);
            const [links, setLinks] = useState([]);

            useEffect(() => {
                let timeout = setTimeout(addNode, 1000);
                return function () {
                    clearTimeout(timeout);
                };

                function addNode() {
                    const node = NODES.pop();
                    if (node) {
                        node.speed = Math.random();
                        nodes.push(node);
                        links.push({source: LOCALHOST, target: node});
                        setNodes([...nodes]);
                        setLinks([...links]);
                        timeout = setTimeout(addNode, 1000);
                    } else {
                        links.pop();
                        nodes.pop();
                        setNodes([...nodes]);
                        setLinks([...links]);
                        timeout = setTimeout(addNode, 1000);
                    }
                }
            }, []);

            return (
                <div style={{padding: 20, height: "100vh"}}>
                    <ReactResizeDetector handleWidth handleHeight>
                        {(width, height) => {
                            if (width) LOCALHOST.fx = width / 2;
                            if (height) LOCALHOST.fy = height / 2;
                            return <ForceLayout width={width} height={height} graph={{nodes, links}}/>;
                        }}
                    </ReactResizeDetector>
                </div>
            )
        }

        return <Story/>;
    })

    .add('gauge arc', function () {

        function Gauge({width, height, value}) {
            const svgRef = useRef(null);
            useEffect(() => {
                const svgElement = svgRef.current;
                const {width, height} = svgElement.getBoundingClientRect();
                const svg = d3.select(svgElement);

                svg.selectAll("*").remove();

                const group = svg.append("g")
                    .attr("class", "gauge")
                    .attr("transform", `translate(${width / 2},${height / 2})`);

                group.append('circle')
                    .attr('r', 5)
                    .attr('fill', d => {
                        if (value < 0.33) {
                            return "red";
                        } else if (value < 0.66) {
                            return "orange";
                        } else {
                            return "green";
                        }
                    });

                group.append("path")
                    .attr("fill", "red")
                    .attr("opacity", "0.33")
                    .attr("d", d3.arc()
                        .innerRadius(10)
                        .outerRadius(15)
                        .startAngle(-Math.PI * 2 / 3)
                        .endAngle(-Math.PI / 3)
                    );
                group.append("path")
                    .attr("fill", "orange")
                    .attr("opacity", "0.33")
                    .attr("d", d3.arc()
                        .innerRadius(10)
                        .outerRadius(15)
                        .startAngle(-Math.PI / 3)
                        .endAngle(Math.PI / 3)
                    );
                group.append("path")
                    .attr("fill", "green")
                    .attr("opacity", "0.33")
                    .attr("d", d3.arc()
                        .innerRadius(10)
                        .outerRadius(15)
                        .startAngle(Math.PI / 3)
                        .endAngle(Math.PI * 2 / 3)
                    );
                group.append("path")
                    .attr("fill", function () {
                        if (value < 0.33) {
                            return "red";
                        } else if (value < 0.66) {
                            return "orange";
                        } else {
                            return "green";
                        }
                    }).attr("opacity", "1")
                    .attr("d", d3.arc()
                        .innerRadius(8)
                        .outerRadius(12)
                        .startAngle(-Math.PI * 2 / 3)
                        .endAngle(d => (value - 0.5) * Math.PI * 4 / 3)
                    );

            }, [width, height]);
            return <svg ref={svgRef} width={width} height={height}/>
        }

        return (
            <div style={{
                padding: 20,
                width: "50vw",
                height: "50vh",
                display: "grid",
                gridTemplateColumns: "50px 50px 50px 50px 50px",
                gridTemplateRows: "50px 50px 50px 50px 50px"
            }}>
                <ReactResizeDetector handleWidth handleHeight>
                    <Gauge value={0.00}/> <Gauge value={0.05}/>
                    <Gauge value={0.10}/> <Gauge value={0.15}/>
                    <Gauge value={0.20}/> <Gauge value={0.25}/>
                    <Gauge value={0.30}/> <Gauge value={0.35}/>
                    <Gauge value={0.40}/> <Gauge value={0.45}/>
                    <Gauge value={0.50}/> <Gauge value={0.55}/>
                    <Gauge value={0.60}/> <Gauge value={0.65}/>
                    <Gauge value={0.70}/> <Gauge value={0.75}/>
                    <Gauge value={0.80}/> <Gauge value={0.85}/>
                    <Gauge value={0.90}/> <Gauge value={0.95}/>
                    <Gauge value={1.00}/> <Gauge value={0.33}/>
                    <Gauge value={0.66}/> <Gauge value={1.00}/>
                </ReactResizeDetector>
            </div>
        )
    })

    .add('peers graph', function () {

        const addresses = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20"
        ];

        function PeersGraphStory() {
            const [peers, setPeers] = useState([]);
            useEffect(() => {
                setInterval(tick, 2400);
                function tick() {
                    setPeers(addresses.map(ip => ({
                        inetSocketAddress: ip,
                        downloaded: Math.floor(3000000 * Math.random()),
                        uploaded: Math.floor(3000000 * Math.random())
                    })).filter(p => Math.random() >= 0.01));
                }
                tick();
            }, []);
            return peers.length && <PeersGraph peers={peers}/> || <div/>
        }

        return (
            <div style={{padding: 20, height: "90vh"}}>
                <PeersGraphStory/>
            </div>
        )
    })