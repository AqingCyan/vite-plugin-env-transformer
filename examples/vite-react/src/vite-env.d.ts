/// <reference types="vite/client" />
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
