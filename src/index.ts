import type { Plugin } from 'vite'

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

export function envReaderPlugin(data: Record<string, string>, resolveId: string): Plugin {
  const RESOLVE_ID = resolveId

  return {
    name: 'vite-plugin-env-virtual-module',
    resolveId(id) {
      if (id === RESOLVE_ID)
        return `\0${RESOLVE_ID}`
    },
    load(id) {
      if (id === `\0${RESOLVE_ID}`) {
        let result: Record<string, any> = {}
        Object.keys(data).forEach((keyName) => {
          if (!keyName.startsWith('VITE')) {
            const hierarchies: string[] = keyName.split('_').map(item => item.toLowerCase())
            const value: string = data[keyName]
            result = genObjectWitchPathNotInTree(result, hierarchies, value)
          }
        })

        return `export default ${JSON.stringify(result)}`
      }
    },
  }
}
