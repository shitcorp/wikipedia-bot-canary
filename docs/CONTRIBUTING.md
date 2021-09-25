# Contributing

## Development Setup

### Pre-requirements

- [Node.js](http://nodejs.org) **version 16+** (for nvm users, just run `nvm use`)
- [Yarn](https://yarnpkg.com/getting-started/install)

### Steps

1. Clone the repo:

    ```bash
    git clone https://github.com/wikipedia-bot/   wikipedia-bot-canary.git
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. **Configuration**:
    Make a copy of the file `.env.example`, name it `.env`, and fill in the values left blank.

4. **Ngrok Setup**:
    If you have an ngrok account, run `export NGROK_TOKEN=<yourToken>`. Then run `yarn ngrok` to start a new tunnel. The tunnel url will be printed to console.
    > **(!)** If your server is not running on port 8020, run `export PORT=<your port>`

5. **Services Setup**:
    To start developing we need a few services set up. [ZooKeeper](https://zookeeper.apache.org) and [Redis](https://redis.io) to be precise. In order to get these 2 services running we provided a docker-compose file that lives in the root of this repository, so its just a matter of running `docker-compose up -d`.

6. Watch code for changes:
    > **(!)** This script only works on linux and mac os since we use the `&` operator. To get the same result on windows run the commands `tsc --watch` and `nodemon dist` in 2 seperate terminals. Another solution would be to install [concurrently](https://www.npmjs.com/package/concurrently) globally and then running the command `yarn dev:windows` or `concurrently "tsc --watch" "nodemon dist"`

    ```bash
    yarn dev
    ```

### Tools

Main tools that used in this project:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for code linting and formatting
- [Slash-Create](https://slash-create.js.org) as framework to interact with the discord API

- [ZooKeeper](https://zookeeper.apache.org/) as distributed configmanager
- [Redis](https://redis.io) as caching solution

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

### `yarn ngrok`

The `ngrok` command starts a new tunnel to ngrok.io so you can do your local developemt without having to own a webserver. Run
```bash
export NGROK_TOKEN=yourNgrokToken
```
first in order for the script to know your ngrok token (mandatory).

To point the ngrok tunnel to a custom port, set the environmental varibale `PORT`.
```bash
export PORT=<your port>
```


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

The `zookeeper:` prefix indicates the command is for `zookeeper`.

The `init` suffix is for setting up the environment for zookeeper.

The `start` suffix is for starting zookeeper.

The `stop` suffix is for stopping zookeeper.
