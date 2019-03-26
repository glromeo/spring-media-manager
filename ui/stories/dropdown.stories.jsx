import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {action} from '@storybook/addon-actions';
import Dropdown from "../src/components/dropdown/Dropdown";
import Options from "../src/components/dropdown/Options";
import {number} from "@storybook/addon-knobs";
import {withLazyStory} from "./decorators";
import ComboBox from "../src/components/dropdown/ComboBox";

storiesOf('Dropdown', module)

    .addDecorator(withLazyStory)

    .add('simple', () => (
        <Dropdown value={"Simple"}
                  options={[
                      {key: 1, value: "Action"},
                      {key: 2, value: "Another action"},
                      {key: 3, value: "Simple"},
                      {key: 4, value: "Something else here"}
                  ]}
                  onChange={action("onChange")}/>
    ))

    .add('virtualized', async () => {

        const response = await fetch("/__mock__/users.json");
        const users = await response.json();

        const options = users.sort((l, r) => {

            let lv = l['last_name'];
            let rv = r['last_name'];
            let compare = lv ? lv.localeCompare(rv) : rv ? -1 : 0;
            if (compare !== 0) {
                return compare;
            }
            lv = l['first_name'];
            rv = r['first_name'];
            compare = lv ? lv.localeCompare(rv) : rv ? -1 : 0;
            if (compare !== 0) {
                return compare;
            }
            lv = l['email'];
            rv = r['email'];
            return lv ? lv.localeCompare(rv) : rv ? -1 : 0;

        }).map(({id, first_name, last_name, email}) => ({
            key: id,
            value: `${last_name},${first_name} (${email})`
        }));

        return (
            <Dropdown value={"Simple"}
                      options={options}
                      onChange={action("onChange")}/>
        );
    })

    .add('datasource', () => {

        function Story() {

            const [options, setOptions] = useState([]);

            const page = number("page", 0);
            const pageSize = number("page size", 100);

            useEffect(() => {
                const options = new Options(page, pageSize);
                options.fetchPage(0).then(setOptions);
            }, []);

            return <Dropdown value="Simple"
                             maxHeight={number('height', 400)}
                             width={number('width', 400)}
                             options={options}
                             onChange={action("onChange")}/>
        }

        return <Story/>
    })

    .add('semantic-ui', () => {

        function Story() {

            const [options, setOptions] = useState([]);

            const page = number("page", 0);
            const pageSize = number("page size", 100);

            useEffect(() => {
                const options = new Options(page, pageSize);
                options.fetchPage(0).then(setOptions);
            }, []);

            return (
                <div>
                    <ComboBox value="Simple"
                              maxHeight={number('height', 400)}
                              width={number('width', 400)}
                              options={options}
                              onChange={action("onChange")}/>
                </div>
            )
        }

        return (
            <div>
                <link rel="stylesheet" type="text/css" href="/semantic-ui-css/semantic.min.css"/>
                <Story/>
            </div>
        )
    })
