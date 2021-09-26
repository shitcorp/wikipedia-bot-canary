// https://github.com/cucumber/cucumber-js/blob/main/docs/nodejs_example.md
const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  variable: number;
  constructor() {
    this.variable = 0;
  }

  setTo(number) {
    this.variable = number;
  }

  incrementBy(number) {
    this.variable += number;
  }
}

setWorldConstructor(CustomWorld);
