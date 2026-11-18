import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Palace of Quests crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-shadow text-white p-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-2">The palace gates jammed.</h1>
            <p className="text-gray-300 mb-4">
              Something broke while loading the game. Reload the page to try again.
            </p>
            {import.meta.env.DEV && this.state.error ? (
              <pre className="text-left text-xs bg-black/50 p-3 rounded overflow-auto">
                {String(this.state.error)}
              </pre>
            ) : null}
            <button
              className="mt-4 px-5 py-2 rounded bg-quest-royal text-white font-semibold"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
