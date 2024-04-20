declare module '*.svg' {
  import * as React from 'react'

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & { className?: string }
  >

  export default ReactComponent
}

/// <reference types="vite/client" />
