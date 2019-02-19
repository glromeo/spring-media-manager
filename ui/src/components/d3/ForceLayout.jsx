import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./ForceLayout.scss";

const color = function (group) {
    switch (group) {
        case 0:
            return "#fbc280";
        case 1:
            return "#aaa";
        default:
            return "#405275";
    }
};

const json = {
    "nodes": [
        {"name": "127.0.0.1", "group": 0},
        {"name": "74.111.127.59", "group": 1},
        {"name": "120.190.245.173", "group": 1},
        {"name": "255.92.45.93", "group": 1},
        {"name": "126.220.124.77", "group": 1},
        {"name": "99.198.110.20", "group": 1},
        {"name": "60.96.111.211", "group": 1},
        {"name": "141.107.60.90", "group": 1},
        {"name": "231.20.172.163", "group": 1},
        {"name": "60.198.14.95", "group": 1},
        {"name": "65.193.50.248", "group": 1}
    ],
    "links": [
        {"source": 0, "target": 1},
        {"source": 0, "target": 2},
        {"source": 0, "target": 3},
        {"source": 0, "target": 4},
        {"source": 0, "target": 5},
        {"source": 0, "target": 6},
        {"source": 0, "target": 7},
        {"source": 0, "target": 8},
        {"source": 0, "target": 9},
        {"source": 0, "target": 10}
    ]
};

export default function ForceLayout({width = "100%", height = "100%"}) {

    const svgRef = useRef(null);

    useEffect(() => {

        const {width, height} = svgRef.current.getBoundingClientRect();

        const force = d3.forceSimulation()
            .force("charge", d3.forceManyBody().strength(-2000).distanceMin(100).distanceMax(1000))
            .force("link", d3.forceLink().id(d => d.index))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY(0.001))
            .force("x", d3.forceX(0.001));

        force
            .nodes(json.nodes)
            .force("link")
            .links(json.links);

        const svg = d3.select(svgRef.current);

        const link = svg.selectAll(".link")
            .data(json.links)
            .enter()
            .append("line")
            .attr("class", "link");

        const node = svg.selectAll(".node")
            .data(json.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", d => {
                    if (!d3.event.active) force.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", d => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                })
                .on("end", d => {
                    if (!d3.event.active) force.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        node.append('circle')
            .attr('r', 5)
            .attr('fill', d => color(d.group));

        node.append("text")
            .attr("dx", (d, i) => i > 0 ? -60 + i : -30)
            .attr("dy", -15)
            .text(d => d.name);

        force.on("tick", function () {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            node.attr("transform", d => {
                return `translate(${d.x},${d.y})`;
            });
        });

    }, [width, height]);

    return (
        <svg ref={svgRef} width={width} height={height}/>
    );
}