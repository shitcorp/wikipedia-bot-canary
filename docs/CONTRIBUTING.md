# Contributing

## Development Setup

Pre-requirement:

- [Node.js](http://nodejs.org) **version 14+**
- [Yarn](https://yarnpkg.com/getting-started/install)

Clone the repo:

```bash
git clone https://github.com/wikipedia-bot/wikipedia-bot-canary.git
```

Install dependencies:

```bash
yarn install
```

Make a copy of the file `.env.example`, name it `.env`, and fill in the values left blank.

Watch code for changes:

```bash
yarn dev
```

Main tools that used in this project:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for code linting and formatting

## Contributing Guidelines

- Make a new branch for your changes, and name it aptly for your changes
- Be sure to test your changes thoroughly
- Follow the pull request template when submitting

## Scripts

### `yarn start`

The `start` command runs the compiled javascript from the `dist` directory.

### `yarn dev`

The `dev` command runs both the `watch` and `pc` commands. It pipes the output of `watch` into `pc`.

### `yarn watch`

The `watch` command runs `nodemon` to watch for changes to the typescript files, and then rebuild the project on the fly.

### `yarn pc`

The `pc` command runs `pino-colada` whichs formats the logs outputed to the console.

### `yarn build`

The `build` command compiles the typescript code into javascript.

### `yarn lint`

The `lint` command use eslint and prettier to check for code or style issues.

### `yarn lint:fix`

The `lint:fix` command uses eslint and prettier to automatically fix `some` code or style issues.

### `yarn contributors:*`

#### `yarn contributors:add`, `yarn contributors:check`, `yarn contributors:generate`

The `contributors:` prefix indicates the command is for `All Contributors`.

The `add` suffix is for adding new contributors to the list of contributors.

The `check` suffix is for checking that all contributors listed by Github are given proper credit.

The `generate` suffix is for generating the list of contributors in the `README.md` file.

### `yarn zk:*`

#### `yarn zk:init`, `yarn zk:start`, `yarn zk:stop`

The `contributors:` prefix indicates the command is for `zookeeper`.

The `init` suffix is for setting up the environment for zookeeper.

The `start` suffix is for starting zookeeper.

The `stop` suffix is for stopping zookeeper.
