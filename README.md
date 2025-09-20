# react-dotenv

> [!WARNING]
> This package is deprecated and archived since `create-react-app` is being sunsetted.
> See: https://react.dev/blog/2025/02/14/sunsetting-create-react-app

Load environment variables dynamically for your React applications created with `create-react-app`.

This will create a `env.js` file in your `public` and `build` directories, which will expose your environment variables you want in the global `window.env` variable.
It will also take care of configuring the `index.html` file present in those directories to load that file.

## Installation

```sh
npm install @ludovicm67/react-dotenv
```

## Usage

### Setup your project

Create a `.env` file at the root of your project, with some relevant values, like this:

```env
API_URL=https://example.com
SOME_OTHER_VARIABLE=foo
```

Open your project's `package.json` file and add:

- the `react-dotenv` command to your `start` and `build` scripts.
- the `react-dotenv.whitelist` property to specify which variables you need to be exposed.

Here is an example:

**package.json**:

```js
{
  // …other fields

  "scripts": {
    "start": "react-dotenv && react-scripts start", // <-- append command
    "build": "react-dotenv && react-scripts build", // <-- append command
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },

  // …some other fields

  // Add the react-dotenv configuration
  "react-dotenv": {
    "whitelist": ["API_URL"]
  }
}
```

### Access environment variables from your code

You can start the development server using the following command:

```sh
npm run start
```

Now your project have the environment variables loaded **globally** in the `window.env` property.

You can access the environment variables from your code in two ways:

#### Using the `@ludovicm67/react-dotenv` library (recommended)

```jsx
import React from "react";
import env from "@ludovicm67/react-dotenv";

const MyComponent = () => {
  return <div>{env.API_URL}</div>;
};

export default MyComponent;
```

#### Using the `window.env` global variable

```jsx
import React from "react";

const MyComponent = () => {
  return <div>{window.env.API_URL}</div>;
};

export default MyComponent;
```

## Known limitations

This only supports one environment (so only one `.env` file) and is not meant to do more.

## Attributions

Forked from [jeserodz/react-dotenv](https://github.com/jeserodz/react-dotenv/commit/5ca0fe8ae117f18ae43ca965534c4c3d13f81897).

**Reasons:**

- upgrade dependencies
- use ESM
- fix TypeScript types
- fix the import of the `env.js` file in the `index.html` files
