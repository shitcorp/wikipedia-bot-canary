/**
 * https://github.com/cucumber/cucumber-js/blob/main/docs/nodejs_example.md
 * https://github.com/cucumber/cucumber-js/blob/main/docs/cli.md
 * https://github.com/cucumber/cucumber-pretty-formatter
 */

const common = ['--publish-quiet ', "--require-module ts-node/register --require 'features/**/*.ts'"];

switch (process.env.CI) {
  case 'true':
    common.push('--format html');
    break;
  case 'json':
    common.push('--format message');
    break;
  case 'false':
  default:
    common.push(
      '--format @cucumber/pretty-formatter --format-options \'{"theme":{"datatable border":["green"],"datatable content":["green","italic"],"docstring content":["green","italic"],"docstring delimiter":["green"],"feature description":["green"],"feature keyword":["bold","green"],"rule keyword":["yellow"],"scenario keyword":["greenBright"],"scenario name":["green","underline"],"step keyword":["bgGreen","black","italic"],"step text":["greenBright","italic"],"tag":["green"]}}\' '
    );
    break;
}

if (process.env.CI !== 'true') {
  // this formatter will be used when running the tests locally
} else if (process.env.CI === 'true') {
  // when running on CI the runtests.sh script will use this formatter
  // and pipe the resulting html to a file that we can use later on
} else
  module.exports = {
    default: common.join(' ')
  };
