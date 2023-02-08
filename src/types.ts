export interface EnvVirtualModulePluginOptions {
  /** Parameters of the vite directive */
  mode: string

  /** plugin resolveId */
  resolveId: string

  /** you can merge data into the virtual module */
  combineData?: Record<string, any>

  /** the prefix of the name of the data allowed to be fetched in the env file */
  envConstantPrefix: string | string[]
}
