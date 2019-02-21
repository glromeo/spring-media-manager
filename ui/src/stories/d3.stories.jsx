import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import ReactResizeDetector from 'react-resize-detector';
import ForceLayout from "../components/d3/ForceLayout";
import * as d3 from "d3";

storiesOf('D3 v5', module)

    .add('simple force layout', () => (
        <div style={{padding: 20, height: "100vh"}}>
            <ReactResizeDetector handleWidth handleHeight>
                <ForceLayout nodes={[
                    {name: "127.0.0.1", group: 0, speed: 0.5},
                    {name: "74.111.127.59", group: 1, speed: 0.33},
                    {name: "120.190.245.173", group: 1, speed: 0.25},
                    {name: "255.92.45.93", group: 1, speed: 0.55},
                    {name: "126.220.124.77", group: 1, speed: 0.65},
                    {name: "99.198.110.20", group: 1, speed: 0.75},
                    {name: "60.96.111.211", group: 1, speed: 0.45},
                    {name: "141.107.60.90", group: 1, speed: 0.15},
                    {name: "231.20.172.163", group: 1, speed: 0.95},
                    {name: "60.198.14.95", group: 1, speed: 1},
                    {name: "65.193.50.248", group: 1, speed: 0.88}
                ]} links={[
                    {source: 0, target: 1},
                    {source: 0, target: 2},
                    {source: 0, target: 3},
                    {source: 0, target: 4},
                    {source: 0, target: 5},
                    {source: 0, target: 6},
                    {source: 0, target: 7},
                    {source: 0, target: 8},
                    {source: 0, target: 9},
                    {source: 0, target: 10}
                ]}/>
            </ReactResizeDetector>
        </div>
    ))

    .add('incremental force layout', () => {

        const LOCALHOST = {name: "127.0.0.1", group: 0};
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

            const nodesRef = useRef(nodes);
            const linksRef = useRef(links);
            nodesRef.current = nodes;
            linksRef.current = links;

            useEffect(() => {
                let timeout = setTimeout(addNode, 1000);
                return function () {
                    clearTimeout(timeout);
                };

                function addNode() {
                    const node = NODES.pop();
                    if (node) {
                        node.speed = Math.random();

                        const nodes = nodesRef.current;
                        const links = linksRef.current;
                        setNodes([...nodes, node]);
                        setLinks([...links, {source: 0, target: nodes.length}]);
                        timeout = setTimeout(addNode, 1000);
                    } else {
                        const nodes = nodesRef.current;
                        const links = linksRef.current;
                        nodes.pop();
                        links.pop();
                        setNodes([...nodes]);
                        setLinks([...links]);
                        timeout = setTimeout(addNode, 1000);
                    }
                }
            }, []);

            return <div style={{padding: 20, height: "100vh"}}>
                <ReactResizeDetector handleWidth handleHeight>
                    {(width, height) => {
                        LOCALHOST.fx = width / 2;
                        LOCALHOST.fy = height / 2;
                        return <ForceLayout width={width} height={height} nodes={nodes} links={links}/>;
                    }}
                </ReactResizeDetector>
            </div>;
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
                const g = svg.append("g")
                    .attr("class", "gauge")
                    .attr("transform", `translate(${width / 2},${height / 2})`);
                g.append("path").attr("fill", "red").attr("opacity", "0.33").attr("d", d3.arc()
                    .innerRadius(6)
                    .outerRadius(14)
                    .startAngle(-Math.PI / 2)
                    .endAngle(-Math.PI / 3)
                );
                g.append("path").attr("fill", "orange").attr("opacity", "0.33").attr("d", d3.arc()
                    .innerRadius(6)
                    .outerRadius(14)
                    .startAngle(-Math.PI / 3)
                    .endAngle(Math.PI / 3)
                );
                g.append("path").attr("fill", "green").attr("opacity", "0.33").attr("d", d3.arc()
                    .innerRadius(6)
                    .outerRadius(14)
                    .startAngle(Math.PI / 3)
                    .endAngle(Math.PI / 2)
                );
                g.append("path").attr("fill", function () {
                    if (value < 0.33) {
                        return "red";
                    } else if (value < 0.66) {
                        return "orange";
                    } else {
                        return "green";
                    }
                }).attr("opacity", "1").attr("d", d3.arc()
                    .innerRadius(7)
                    .outerRadius(10)
                    .startAngle(-Math.PI / 2)
                    .endAngle((value - 0.5) * Math.PI)
                );

            }, [width, height]);
            return <svg ref={svgRef} width={width} height={height}/>
        }

        return (
            <div style={{padding: 20, height: "100vh"}}>
                <ReactResizeDetector handleWidth handleHeight>
                    <Gauge value={0.30}/>
                </ReactResizeDetector>
            </div>
        )
    });