## debug storybook

package.json 
```json
{
  "scripts": {
    "storybook": "node $NODE_DEBUG_OPTION node_modules/.bin/start-storybook -p 9001 -c .storybook"
  }
}
```