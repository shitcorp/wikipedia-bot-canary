import { FluentBundle, FluentResource } from '@fluent/bundle';
import { readFile } from 'fs/promises';
import { Bundle } from '../@types/bundle';

// import resources
// import enResource from './locales/en-US.ftl';

export const bundle: Bundle = {
  'en-US': new FluentBundle('en-US'),
  de: new FluentBundle('de')
};

export const importResource = async (locale: string) => {
  try {
    const resource = (await readFile(`../locales/${locale}.ftl`)).toString();

    const errors = bundle[locale].addResource(new FluentResource(resource));

    for (let i = 0; i < errors.length; i++) {
      console.error(errors[i]);
    }
  } catch (e) {
    // Deal with the fact the chain failed
  }
};

importResource('en-US');
importResource('de');

// (async () => {
//   try {
//     // import resources
//     const enResource = (await readFile('../locales/en-US.ftl')).toString();
//     const deResource = (await readFile('../locales/de.ftl')).toString();

//     // add resource to bundle and check for errors
//     const enErrors = bundle.en.addResource(new FluentResource(enResource));
//     if (enErrors.length) {
//       // Syntax errors are per-message and don't break the whole resource
//     }

//     const deErrors = bundle.de.addResource(new FluentResource(deResource));
//     if (deErrors.length) {
//       // Syntax errors are per-message and don't break the whole resource
//     }
//   } catch (e) {
//     // Deal with the fact the chain failed
//   }
// })();

// const welcome = bundle.en.getMessage('welcome');
// if (welcome.value) {
//   bundle.en.formatPattern(welcome.value, { name: 'Anna' });
//   // → "Welcome, Anna, to Foo 3000!"
// }
