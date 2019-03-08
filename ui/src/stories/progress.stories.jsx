import React, {useEffect, useRef, useState} from "react";
import {storiesOf} from "@storybook/react";
import SockJsClient from "react-stomp";

import ProgressBar from "../components/ProgressBar";

import "./electronic-diagram.sass";

storiesOf('Progress', module)

    .add('simple', () => (
        <div style={{padding: 20}}>
            <ProgressBar value={10} total={100}/>
        </div>
    ))

    .add('stomp', () => {

        let initialized = false;

        function StompStory() {

            const [value, setValue] = useState(0);
            const clientRef = useRef();

            if (!initialized) {
                initialized = true;
                setTimeout(() => {
                    const client = clientRef.current;
                    client.sendMessage('/app/progress', JSON.stringify({
                        operation: "hello progress"
                    }));
                }, 1000);
            }

            return <div style={{padding: 20}}>
                <ProgressBar value={value} total={100}/>
                <SockJsClient ref={clientRef} url='http://localhost:8080/api/socket'
                              topics={['/topic/progress']}
                              onMessage={(message) => {
                                  setValue(message.value);
                              }}/>
            </div>;
        }

        return <StompStory/>
    })

    .add('electrospheres', () => {

        class Atom {

            constructor(atomic) {
                this.atomic = atomic
                this.buildElectronicDiagram()
                this.distributeElectrons()
            }

            // Creates a non-linear 2D array as the Aufbau principle
            // to later distribute the values over the structure.
            // This generates an array with the following aspect:
            //          S  P  D  F
            //  1(K) - [0] :  :  :
            //  2(L) - [0, 0] :  :
            //  3(M) - [0, 0, 0] :
            //  4(N) - [0, 0, 0, 0]
            //  5(O) - [0, 0, 0, 0]
            //  6(P) - [0, 0, 0] :
            //  7(Q) - [0, 0] :  :

            buildElectronicDiagram() {

                // Definition of the matrix with 7 lines,
                // followed by an compreension loop that will
                // define the number of columns of each line.

                this.electronicLayers = new Array(7)
                    .fill()
                    .map((_, x) => {
                        // Variable that determines the number of columns of each row.
                        // f(x) = 4.5 -|x - 3.5|
                        // (0 <= x <= 6) {1, 2, 3, 4, 4, 3, 2}
                        const length = 4.5 - Math.abs(x - 3.5)
                        return new Array(length).fill(0)
                    })
            }

            distributeElectrons() {

                // Variables that selects the row(layer) and column(sublevel)
                // from the starting point of each step.
                let layer = 0
                let sublevel = 0

                // Variable that records the count of electrons.
                let electrons = this.atomic

                // Loop that performs the distribution process
                // until all electrons have been distributed.
                while (electrons > 0) {
                    // Variables that select the row(x) and column(y) of the array.
                    let x = layer
                    let y = sublevel

                    // Loop that shifts the iteration pointer from the array,
                    // from the starting point and moving to the previous column
                    // of the next line, as a diagonal move, until you reach column 0 or line 6.
                    for (; y >= 0 && x <= 6; x++, y--) {
                        // Variable that defines a limit of electrons
                        // that can be iterated in certain point of the matrix,
                        // influenced by the pointed column(y)...
                        // f(x) = 4x + 2
                        // (0 <= x <= 3) {2, 6, 10, 14}
                        const maxDecay = 2 + 4 * y

                        // If the number of electrons is lower than the column boundary,
                        // the decay will be the total number of electrons.
                        const decay = Math.min(electrons, maxDecay)

                        this.electronicLayers[x][y] = decay
                        electrons -= decay
                    }

                    // It makes the offset of the starting point alternating in each step
                    // between moving to the next line and moving to the next column.
                    if (layer === sublevel) layer++
                    else sublevel++
                }
            }


            // Returns the total number of electrons disposed in each layer.
            get electrospheresLength() {
                const result = []

                this.electronicLayers.forEach((layer) => {
                    const total = layer.reduce((a, b) => a + b)

                    result.push(total)
                })

                return result
            }
        }


        function renderElectronicLayers(parent, selector, atom) {
            const element = parent.querySelector(selector)
            const html = document.createElement('div')

            for (const index in atom.electronicLayers) {
                const layer = atom.electronicLayers[index]
                const layerLength = atom.electrospheresLength[index]
                const electrosphere = document.createElement('div')

                electrosphere.classList.add('electrosphere', `layer-${index}`)

                if (layerLength)
                    electrosphere.style.setProperty('--length', layerLength)
                else
                    electrosphere.classList.add('empty-layer')

                for (let i = 0; i < layerLength; i++) {
                    const electron = document.createElement('div')

                    electron.classList.add('electron')
                    electron.style.setProperty('--index', i)
                    electrosphere.appendChild(electron)
                }

                html.appendChild(electrosphere)
            }

            element.innerHTML = html.innerHTML
        }

        let kripton = new Atom(36)

        function Electrosphere() {

            const atomRef = useRef(null);

            useEffect(() => {
                renderElectronicLayers(atomRef.current, ".electrospheres", kripton);
            }, [])

            return (
                <div ref={atomRef}>
                    <div className="content-wrap">
                        <div className="content-card">
                            <div className="Atom">
                                <div className="nucleus"/>
                                <div className="electrospheres"/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return <Electrosphere/>
    })