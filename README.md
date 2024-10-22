# load-mf-remote
A simple loader for a module federation remote

## Installation

```bash
npm install load-mf-remote
```

## Usage
This module exposes a `loadMFRemote` function that takes a remote descriptor and returns a promise that resolves to a tuple of an error and a function that can be used to get a module from the remote. It is either `[Error, null]` or `[null, getModule]`.

The remote descriptor is a string that follows the following format:

`container@https://example.com/module-federated-remote.js`

Where `container` is the name of the container and `https://example.com/module-federated-remote.js` is the url of the remote.

the function `getModule` takes a string as an argument and returns a promise that resolves to the module.


**Example**

```ts
import { loadMFRemote } from "load-mf-remote";

const [err, getModule] = await loadMFRemote("container@https://example.com/module-federated-remote.js");

if (err) {
  console.error(err);
  return;
}

const Module = await getModule("module-name");
```

This has to be used inside a `React.lazy` function.

```tsx
import { loadMFRemote } from "load-mf-remote";

const Module = React.lazy(() => {
  const [err, getModule] = await loadMFRemote("container@https://example.com/module-federated-remote.js");

  if (err) {
    throw err; // handle error here as you see fit
    return;
  }

  return getModule("module-name");
});
```

## License

MIT