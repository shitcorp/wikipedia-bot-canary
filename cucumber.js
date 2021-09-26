/**
 * https://github.com/cucumber/cucumber-js/blob/main/docs/nodejs_example.md
 * https://github.com/cucumber/cucumber-js/blob/main/docs/cli.md
 * https://github.com/cucumber/cucumber-pretty-formatter
 */

module.exports = {
  default:
    '--publish-quiet ' +
    '--format @cucumber/pretty-formatter --format-options \'{"theme":{"datatable border":["green"],"datatable content":["green","italic"],"docstring content":["green","italic"],"docstring delimiter":["green"],"feature description":["green"],"feature keyword":["bold","green"],"rule keyword":["yellow"],"scenario keyword":["greenBright"],"scenario name":["green","underline"],"step keyword":["bgGreen","black","italic"],"step text":["greenBright","italic"],"tag":["green"]}}\' ' +
    "--require-module ts-node/register --require 'features/**/*.ts'"
};
