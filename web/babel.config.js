module.exports = function (api) {

    api.cache(true);

    const presets = [
        [
            "@babel/preset-env",
            {
                targets: {
                    browsers: ["last 2 versions", "safari >= 7"],
                    esmodules: true,
                    node: true
                },
                useBuiltIns: "usage",
                shippedProposals: true,
                modules: false
            },
        ],
        "@babel/preset-react"
    ];
    const plugins = [
        ["@babel/plugin-proposal-decorators", {decoratorsBeforeExport: false}]
    ];

    return {
        presets,
        plugins
    };

};