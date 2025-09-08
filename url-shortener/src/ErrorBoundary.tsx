import React from "react";
import { Log } from "./logger";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  async componentDidCatch(error: any, info: React.ErrorInfo) {
    this.setState({ hasError: true });
    try {
      await Log(
        "frontend",
        "fatal",
        "component",
        `Uncaught render error: ${error?.message ?? error} ${info.componentStack}`
      );
    } catch {
      // don't crash if logging fails
      console.error("Failed to log boundary error");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 30 }}>
          <h2>Something went wrong.</h2>
          <p>Reload the page or contact the evaluator.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
