import * as path from 'path'
import { loadEnv } from 'vite'
import type { Plugin } from 'vite'
import type { EnvVirtualModulePluginOptions } from './types'

/**
 * read target env file
 * @param mode
 * @param prefix
 */
function loadTargetEnvFile(mode: string, prefix: string | string[]): Record<string, string> {
  return loadEnv(mode, path.join(process.cwd(), 'envs'), prefix)
}

/**
 * [a, b, c, d] + value => {a: { b: { c: { d: value } } } }
 * @param arr
 * @param value
 */
function arrayTransformObject(arr: string[], value: string): Record<string, any> {
  const obj = {}
  arr.forEach((item) => {
    if (arr.length === 1) {
      obj[item] = value
    }
    else {
      arr.shift()
      obj[item] = arrayTransformObject(arr, value)
    }
  })
  return obj
}

function genObjectWitchPathNotInTree(object: Record<string, any>, path: string[], value: string) {
  let currentObject = object
  let parentObject: Record<string, any> = null
  let lastKey
  const newPath = [...path]
  for (let i = 0; i < path.length; i++) {
    if (currentObject[path[i]]) {
      parentObject = currentObject
      currentObject = currentObject[path[i]]
      lastKey = newPath.shift()
    }
    else {
      break
    }
  }
  const children = arrayTransformObject([...newPath], value)
  if (typeof currentObject !== 'object')
    parentObject[lastKey] = children
  else
    currentObject[newPath[0]] = children[newPath[0]]

  return JSON.parse(JSON.stringify(object))
}

export function envVirtualModule(options: EnvVirtualModulePluginOptions): Plugin {
  const { resolveId, mode, combineData, envConstantPrefix } = options

  const envData = loadTargetEnvFile(mode, envConstantPrefix)

  return {
    name: 'vite-plugin-env-virtual-module',
    resolveId(id) {
      if (id === resolveId)
        return `\0${resolveId}`
    },
    load(id) {
      if (id === `\0${resolveId}`) {
        let result: Record<string, any> = {}
        Object.keys(envData).forEach((keyName) => {
          if (!keyName.startsWith('VITE')) {
            const hierarchies: string[] = keyName.split('_').map(item => item.toLowerCase())
            const value: string = envData[keyName]
            result = genObjectWitchPathNotInTree(result, hierarchies, value)
          }
        })

        const data = { ...result, ...combineData }

        return `export default ${JSON.stringify(data)}`
      }
    },
  }
}
