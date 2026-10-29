import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, details) {
    if (import.meta.env.DEV) console.error("Application error", error, details);
  }

  render() {
    if (this.state.hasError) {
      return <main className="error-state"><img src="/brand-mark.svg" alt="" width="52" height="52" /><span className="eyebrow"><i /> Something went wrong</span><h1>We couldn’t load the workspace.</h1><p>Your saved signature is still stored safely in this browser.</p><button onClick={() => window.location.reload()}>Reload application</button></main>;
    }
    return this.props.children;
  }
}
