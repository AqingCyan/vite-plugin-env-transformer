<img src="./assets/logo.png" alt="logo of vite-plugin-env-transformer repository" width="100" height="100" align="right" />

# vite-plugin-env-transformer

This is a vite plugin. It parses the configuration from your `.env` file into an object and allows you to import it as an ES module in your code.

English | [简体中文](./README.zh-CN.md)

## Installation

```
pnpm i -D vite-plugin-env-transformer
```

## Usage

Create an envs folder in the root directory, add some `.env.[mode]` files like this:

```dotenv
# envs/.env.dev
VITE_BASE_URL='https://github.com/AqingCyan/vite-plugin-env-transform-module'

SYSTEM_NAME='demo project'
SYSTEM_CONFIG_ONE='config one'
SYSTEM_CONFIG_TWO='config two'
SYSTEM_CONFIT_THREE_TEXT='demo text'
```

Your `.env.[mode]` file's mode is `dev`. 

Your env variable will be read in a tree structure.

```ts
const system = {
  name: 'demo project',
  config: {
    one: 'config one',
    two: 'config two',
    three: {
      text: 'demo text'
    }
  }
}
```

```ts
// vite.config.ts
import { ConfigEnv, defineConfig } from 'vite'
import { envTransformModule } from 'vite-plugin-env-transformer'

const options = { mode, resolveId: 'demo:siteData', envConstantPrefix: 'SYSTEM' }

export default ({ mode }: ConfigEnv) => {
  plugins: [envTransformModule(options)]
}
```

Now when your project compiles, you get a module called `demo:siteData` that contains the configuration you wrote in the `.env.dev` file.

This module is virtual, so we also need to write type.

```ts
///<reference types="vite/client" />
interface SiteData {
  readonly system: {
    name: string
    config: {
      one: string
      two: string
      three: {
        text: string
      }
    }
  }
}

declare module 'demo:siteData' {
  const siteData: SiteData
  export default siteData
}
```

Now you can use it in your project!

```tsx
// App.tsx
import siteData from 'demo:siteData'

console.log(siteData)
```

see [example](./examples/)

## Options
// TODO

## TODO
// TODO
