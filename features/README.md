# Testing

This folder contains our test and gherkin feature files. To add a new test, add your feature as a new .feature file, describe the feature and some scenarios, then run `yarn test`. Cucumber will print the snippets that you can use to implement said scenarios. Create a new typescript file in the [support folder](./support) that has the same name as your feature file. Paste the snippets suggested by cucumber in here and implement your logic.


Learn more about cucumber and gherkin here: https://github.com/cucumber/cucumber-js
