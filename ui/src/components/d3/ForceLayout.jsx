import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import "./ForceLayout.scss";

export default function ForceLayout({width, height, graph}) {

    const svgRef = useRef(null);
    const simulationRef = useRef(null);

    const nodes = graph.nodes;
    const links = graph.links;

    useEffect(() => {
        const {width, height} = svgRef.current.getBoundingClientRect();
        const simulation = simulationRef.current = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.name).distance(200))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(25))
            .alphaTarget(1);
        const svg = d3.select(svgRef.current);
        simulation.on("tick", function () {
            svg.selectAll(".link")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            // svg.selectAll(".inbound circle")
            //     .attr("cx", d => d.target.x)
            //     .attr("cy", d => d.target.y);
            // svg.selectAll(".outbound circle")
            //     .attr("cx", d => d.source.x)
            //     .attr("cy", d => d.source.y);
            svg.selectAll(".inbound")
                .attr("transform", l => `translate(${l.target.x},${l.target.y})`);
            // svg.selectAll(".outbound")
            //     .attr("transform", l => `translate(${l.target.x},${l.target.y})`);
            svg.selectAll(".node")
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });
        return () => {
            simulation.stop();
        }
    }, []);

    useEffect(() => {
        const {width, height} = svgRef.current.getBoundingClientRect();
        const simulation = simulationRef.current;
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.restart();
        console.log("restarted due to resize");
    }, [width, height]);

    useEffect(() => {

        const svg = d3.select(svgRef.current);

        const link = svg.selectAll(".link").data(links, d => d.source.name + d.target.name);
        link.exit().remove();
        link.enter()
            .append("line")
            .attr("class", "link")
            .lower();

        // const transitionOut = d3.transition()
        //     .duration(1000)
        //     .ease(d3.easeLinear);
        //
        // const outbound = svg.selectAll(".outbound").data(links.filter(l => l.target.out > 0), d => d.target.name + d.target.out);
        // outbound.exit().remove();
        // outbound.enter()
        //     .append("circle")
        //     .attr("class", "outbound")
        //     .attr('r', 10)
        //     .attr('cx', l => l.source.x)
        //     .attr('cy', l => l.source.y)
        //     .attr('fill', l => {
        //         const value = l.target.out * 1000;
        //         if (value < 33) {
        //             return "red";
        //         } else if (value < 66) {
        //             return "orange";
        //         } else {
        //             return "green";
        //         }
        //     })
        //     .transition(transitionOut)
        //     .attr("cx", l => l.target.x - l.source.x)
        //     .attr("cy", l => l.target.y - l.source.y)

        let inbound = svg.selectAll(".inbound").data(links, d => d.target.name + d.target.downloaded)
        inbound.exit().remove();
        inbound = inbound.enter()
            .append("g")
            .attr("class", "inbound")
            .append("circle")
            .attr('r', 20)
            .attr('fill', l => {
                const value = l.target.downloaded * 1000;
                if (value < 33) {
                    return "red";
                } else if (value < 66) {
                    return "orange";
                } else {
                    return "green";
                }
            })
            .transition()
            .duration(1200)
            .ease(d3.easeQuadInOut)
            .attr('r', 0)
            .attr("cx", l => l.source.x - l.target.x)
            .attr("cy", l => l.source.y - l.target.y)

        const node = svg.selectAll(".node").data(nodes, d => d.name);
        node.exit().remove();

        const g = node.enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", d => {
                    console.log("start");
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
                    if (!d.fixed) {
                        d.fx = null;
                        d.fy = null;
                    }
                }));

        g.append('circle')
            .attr('r', d => d.group === 0 ? 50 : 10)
            .attr('fill', "gray");

        g.append("text")
            .attr("dx", (d, i) => i > 0 ? -60 + i : -30)
            .attr("dy", -15)
            .text(d => d.name);

        const simulation = simulationRef.current;
        simulation.nodes(nodes);
        simulation.force("link").links(links);
        simulation.alphaTarget(0.3).restart();

    }, [graph]);

    return (
        <svg ref={svgRef} width={width} height={height}/>
    );
}