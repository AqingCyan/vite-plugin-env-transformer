<img src="./assets/logo.png" alt="logo of vite-plugin-env-transformer repository" width="100" height="100" align="right" />

# vite-plugin-env-transformer

这是一个 vite 插件，它负责将你的 `.env` 文件中的配置转化为对象，并支持你在项目中将它作为 ES module 导入。

简体中文 | [English](./README.md)

## Installation

```
pnpm i -D vite-plugin-env-transformer
```

## Usage

创建一个 envs 文件夹在根目录，添加一些 `.env.[mode]` 文件，如下面这样：

```dotenv
# envs/.env.dev
VITE_BASE_URL='https://github.com/AqingCyan/vite-plugin-env-transform-module'

SYSTEM_NAME='demo project'
SYSTEM_CONFIG_ONE='config one'
SYSTEM_CONFIG_TWO='config two'
SYSTEM_CONFIT_THREE_TEXT='demo text'
```

你的 `.env.[mode]` 文件的 mode 后缀是 `dev`。

你的 env 变量将会被解析为树结构，像下面这样。

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

export default defineConfig(({ mode }: ConfigEnv) => {
  plugins: [envTransformModule(options)]
});
```

现在,你的项目将在编译时，得到一个名为 `demo:siteData` 的模块，它其中包含了你在 `.env.dev` 文件中编写的配置。

这个模块是虚拟的，所以我们也得提供一下它的类型。

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

现在你可以在你的项目中使用它了！

```tsx
// App.tsx
import siteData from 'demo:siteData'

console.log(siteData)
```

// TODO
see [example](./examples/)

## Options
// TODO

## TODO
// TODO
