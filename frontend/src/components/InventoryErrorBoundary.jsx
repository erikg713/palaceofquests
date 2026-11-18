import React from 'react';

class InventoryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Optionally log error to an external service
    if (import.meta.env.DEV) {
      console.error('InventoryList crashed:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-800 text-white p-4 rounded shadow mb-4" role="alert">
          <strong>Something went wrong loading your inventory.</strong>
        </div>
      );
    }

    return this.props.children;
  }
}

export default InventoryErrorBoundary;
