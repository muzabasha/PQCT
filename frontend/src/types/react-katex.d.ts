declare module 'react-katex' {
  import React from 'react';

  interface MathProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: any;
    children?: React.ReactNode;
  }

  export class InlineMath extends React.Component<MathProps> {}
  export class BlockMath extends React.Component<MathProps> {}
}
