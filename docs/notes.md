# General things to account for

## Pino

```ts
// error
logger.error(error, 'an error happened'); // good
logger.error('an error happened', error); //bad, doesn't handle error object right

// everything else
logger.info({ makeArgs: 'an object' }, 'message'); // good
logger.info('message', 'i wont', { be: 'logged' }); //bad
```
