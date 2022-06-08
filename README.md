# react-dotenv 🎛

Forked from [jeserodz/react-dotenv](https://github.com/jeserodz/react-dotenv/commit/5ca0fe8ae117f18ae43ca965534c4c3d13f81897).

Load environment variables dynamically for your React applications created with CRA (Create-React-App).

# Installation

```sh
npm install @ludovicm67/react-dotenv
```

# Usage

## 1. Setup your project

Open your project's `package.json` file and:

1. Add an `.env` file to your project root (or just load from the system environment variables).
1. Add the `react-dotenv` NPM command to your `start`, `build` (and your `serve` commands).
1. Add the `react-dotenv.whitelist` property to `package.json` to specify which variables you need exposed.

### Example

**package.json**:
```js
{
  // …

  "scripts": {
    "start": "react-dotenv && react-scripts start", // <-- append command
    "build": "react-dotenv && react-scripts build", // <-- append command
    "serve": "react-dotenv && serve build", // <-- append command
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  // Add the react-dotenv configuration
  "react-dotenv": {
    "whitelist": ["API_URL"]
  }
}
```

## 2. Run your project

```sh
npm start
```

Now your project have the environment variables loaded **globally** in the `window.env` property.

## 3. Read the environment variables

You can access the environment variables from your code in two ways:

### A. Using the `react-dotenv` library

```jsx
import React from "react";
import env from "@ludovicm67/react-dotenv";

export function MyComponent() {
  return <div>{env.API_URL}</div>;
}
```

### B. Using the `window.env` global variable

```jsx
import React from "react";

export function MyComponent() {
  return <div>{window.env.API_URL}</div>;
}
```
