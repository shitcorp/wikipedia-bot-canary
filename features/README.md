# Testing

This folder contains our test and gherkin feature files.

We use [cucumber](https://cucumber.io) as our testing framework. Read their documentation to get a sense of what it is about.

To add a new test, add your feature as a new `.feature` file, describe the feature adn add some scenarios.

Then run `yarn test`. Cucumber will print the snippets that you can use to implement said scenarios.

Create a new typescript file in the [support folder](./support) that has the same name as your feature file. Paste the snippets suggested by cucumber in there and implement your logic.

## Remarks:

> When runnin the tests locally you might get this warning:
> ```console
> ./features/runtests.sh: line 6: [: ==: unary operator expected
> ```
> You can safely ignore that. If youre curious, you can read more [here](https://codefather.tech/blog/bash-unary-operator-expected/)


## Links
Learn more about cucumber here:

- [Github Repo](https://github.com/cucumber/cucumber-js)
- [Cucumber and Gherkin Docs](https://cucumber.io)
