const path = require("path");

module.exports = async ({ config, mode }) => {
    config.devServer = {
        contentBase: [path.resolve(__dirname, "node_modules")]
    }
    return config;
}