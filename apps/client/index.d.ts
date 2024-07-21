import PageSpyConstructor from '@huolala-tech/page-spy-browser'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  class PageSpy extends PageSpyConstructor {}
  interface Window {
    $pageSpy: PageSpy | null
  }
}
