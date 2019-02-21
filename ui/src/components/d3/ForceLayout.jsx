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

export default function ForceLayout({width = "100%", height = "100%", nodes, links}) {

    const svgRef = useRef(null);
    const simulationRef = useRef(null);

    useEffect(() => {

        const {width, height} = svgRef.current.getBoundingClientRect();

        const simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.index))
            .force("charge", d3.forceManyBody().strength(-2000).distanceMin(100).distanceMax(1000))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY(0.001))
            .force("x", d3.forceX(0.001));

        const svg = d3.select(svgRef.current);

        simulation.on("tick", function () {
            svg.selectAll(".link").attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            svg.selectAll(".node").attr("transform", d => {
                return `translate(${d.x},${d.y})`;
            });
        });

        simulationRef.current = simulation;

        return () => {
            simulation.stop();
        }
    }, []);

    useEffect(() => {
        const {width, height} = svgRef.current.getBoundingClientRect();
        const {current: simulation} = simulationRef;
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.alphaTarget(0.3).restart();
    }, [width, height]);

    useEffect(() => {

        const svg = d3.select(svgRef.current);
        const {current: simulation} = simulationRef;

        let link = svg.selectAll(".link").data(links, d => d.source + "," + d.target);
        link.exit().remove();
        link = link.enter()
            .append("line")
            .attr("class", "link")
            .lower();

        let node = svg.selectAll(".node").data(nodes, d => d.name);
        node.exit().remove();
        node = node.enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", d => {
                    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", d => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                })
                .on("end", d => {
                    if (!d3.event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }))
            .each(d => {
                d.x = width / 2 * (1 + (Math.random() - .5));
                d.y = height / 2 * (1 + (Math.random() - .5));
            });
        node.append('circle')
            .attr('r', 5)
            .attr('fill', d => {
                const value = d.speed * 100;
                if (value < 33) {
                    return "red";
                } else if (value < 66) {
                    return "orange";
                } else {
                    return "green";
                }
            });

        node.append("text")
            .attr("dx", (d, i) => i > 0 ? -60 + i : -30)
            .attr("dy", -15)
            .text(d => d.name);

        node.append("path")
            .attr("fill", "red")
            .attr("opacity", "0.33")
            .attr("d", d3.arc()
                .innerRadius(10)
                .outerRadius(15)
                .startAngle(-Math.PI * 2 / 3)
                .endAngle(-Math.PI / 3)
            );
        node.append("path")
            .attr("fill", "orange")
            .attr("opacity", "0.33")
            .attr("d", d3.arc()
                .innerRadius(10)
                .outerRadius(15)
                .startAngle(-Math.PI / 3)
                .endAngle(Math.PI / 3)
            );
        node.append("path")
            .attr("fill", "green")
            .attr("opacity", "0.33")
            .attr("d", d3.arc()
                .innerRadius(10)
                .outerRadius(15)
                .startAngle(Math.PI / 3)
                .endAngle(Math.PI * 2 / 3)
            );
        node.append("path")
            .attr("fill", d => {
                const value = d.speed * 100;
                if (value < 33) {
                    return "darkred";
                } else if (value < 66) {
                    return "darkorange";
                } else {
                    return "darkgreen";
                }
            })
            .attr("opacity", "1")
            .attr("d", d3.arc()
                .innerRadius(8)
                .outerRadius(12)
                .startAngle(-Math.PI * 2 / 3)
                .endAngle(d => (d.speed - 0.5) * Math.PI * 4 / 3)
            ).lower();

        simulation
            .nodes(nodes)
            .force("link")
            .links(links);

    }, [nodes, links]);

    return (
        <svg ref={svgRef} width={width} height={height}/>
    );
}