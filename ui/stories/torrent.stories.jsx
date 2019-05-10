import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {number, text} from "@storybook/addon-knobs";

storiesOf("torrent", module)

    .add("scrapers search", () => {

        function Story() {

            const [query, setQuery] = useState(text("query", "Spider Man Verse"));
            const [results, setResults] = useState([]);

            useEffect(() => {
                const controller = new AbortController();
                const signal = controller.signal;
                const q = encodeURIComponent(query.toLocaleLowerCase().replace(/\W+/g, " "));
                fetch(`/api/search/torrent?query=${encodeURIComponent(q)}`, {method: "GET", signal})
                    .then(response => response.json())
                    .then(json => {
                        setResults(json);
                    })
                    .catch(error => {
                        console.error("error while searching torrent:",);
                    })
                return () => {
                    controller.abort();
                }
            }, [])

            return (
                <div className="container">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><a className="fa fa-search"/></span>
                        </div>
                        <input type="text" className="form-control" placeholder="Search torrent"
                               value={query} onChange={({target}) => setQuery(target.value)}/>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">TITLE</th>
                            <th scope="col">DATE UPLOADED</th>
                            <th scope="col">GENRES</th>
                            <th scope="col">IMDB CODE</th>
                            <th scope="col">SLUG</th>
                            <th scope="col">STATE</th>
                            <th scope="col">TITLE LONG</th>
                            <th scope="col">TORRENTS</th>
                            <th scope="col">URL</th>
                            <th scope="col">YEAR</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map(result => (
                            <tr>
                                <th scope="row">result.id</th>
                                <td>result.title</td>
                                <td>result.dateUploaded</td>
                                <td>result.genres</td>
                                <td>result.imdbCode</td>
                                <td>result.slug</td>
                                <td>result.state</td>
                                <td>result.titleLong</td>
                                <td>result.torrents</td>
                                <td>result.url</td>
                                <td>result.year</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )
        }

        return <Story/>
    })
