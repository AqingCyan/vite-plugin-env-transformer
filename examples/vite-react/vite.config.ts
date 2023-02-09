import type { ConfigEnv, UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
import { envTransformModule } from 'vite-plugin-env-transformer'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  return {
    base: '/',
    plugins: [
      react(),
      envTransformModule({
        mode,
        resolveId: 'demo:siteData',
        combineData: { demo: 'hello world' },
        envConstantPrefix: ['SYSTEM'],
      }),
    ],
  }
}
