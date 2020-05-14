var path = require('path');
const {
    override,
    disableEsLint,
    addExternalBabelPlugins,
    addDecoratorsLegacy,
    setWebpackOptimizationSplitChunks,
    babelInclude,
    disableChunk,
    addBabelPresets,
} = require('customize-cra');

const addStylusLoader = require('customize-cra-add-stylus-loader');

module.exports = function (config, env) {
    //return config;
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
        cacheGroups: {
            default: false,
        },
    };
    return Object.assign(config, override(
        addStylusLoader({}),
        disableEsLint(),
        addDecoratorsLegacy(),
        addExternalBabelPlugins('@babel/plugin-proposal-class-properties'),
        addBabelPresets('@babel/preset-react'),
        setWebpackOptimizationSplitChunks(
            {
                cacheGroups: {
                    default: false,
                },
            }),
        disableChunk(),
        babelInclude([
            path.resolve('src'), // don't forget this
        ]))(config, env));
};