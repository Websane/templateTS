declare module '*.module.css'
declare module '\*.svg' {
  import * as React from 'react'
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}
declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.gif";
