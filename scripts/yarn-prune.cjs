/**
 * Approximate `npm prune --production` using `yarn remove`.
 * @see https://github.com/yarnpkg/yarn/issues/696
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = require('child_process').exec;
const devDependencies = Object.keys(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../package.json').devDependencies,
).join(' ');
const command = 'yarn remove ' + devDependencies;

const child = exec(command, (err, stdout, stderr) => {
  if (err) throw err;
  console.log(`stdout: \n${stdout}`);
  console.log(`stderr: \n${stderr}`);
});
