# Hierarchical Tree Selection Component

A scalable, accessible React component for hierarchical data selection with support for virtualization, async loading, and multi-select functionality.

## Features

- ✅ **Virtualized Rendering** - Handle 50k+ nodes efficiently
- ✅ **Multi-Select** - Select individual items or entire branches
- ✅ **Async Loading** - Load data on-demand for large datasets
- ✅ **Search** - Fast filtering with context preservation
- ✅ **Keyboard Navigation** - Full keyboard accessibility
- ✅ **ARIA Compliant** - WCAG 2.1 AA standards
- ✅ **TypeScript** - Full type safety
- ✅ **Tested** - Comprehensive unit and integration tests

## Installation

```bash
npm install hierarchical-tree-selection
```

## Quick Start

```tsx
import { TreeCombobox } from 'hierarchical-tree-selection';
import 'hierarchical-tree-selection/dist/style.css';

function App() {
  const treeData = [
    {
      id: '1',
      label: 'Parent',
      children: [
        { id: '1-1', label: 'Child 1' },
        { id: '1-2', label: 'Child 2' }
      ]
    }
  ];

  const handleSelectionChange = (selectedIds: Set<string>) => {
    console.log('Selected:', Array.from(selectedIds));
  };

  return (
    <TreeCombobox
      data={treeData}
      onSelectionChange={handleSelectionChange}
      placeholder="Select items..."
    />
  );
}
```

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone repository
git clone <repository-url>
cd internship\ 2

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run storybook        # Start Storybook on port 6006

# Build
npm run build            # Build for production
npm run build-storybook  # Build Storybook

# Testing
npm test                 # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Accessibility
npm run a11y:audit       # Run accessibility audit

# Deployment
npm run chromatic        # Deploy to Chromatic
```

## Documentation

- [Quick Start Guide](./QUICK_START.md) - Get started in 5 minutes
- [API Documentation](./API.md) - Complete API reference
- [Accessibility Guide](./ACCESSIBILITY.md) - WCAG compliance details
- [Performance Guide](./PERFORMANCE.md) - Optimization strategies
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment

## Architecture

The component is built with:

- **React 18** - UI framework with concurrent features
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **Storybook** - Component documentation and testing
- **TailwindCSS** - Utility-first styling

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Accessibility

This component is designed with accessibility as a priority:

- ARIA 1.2 compliant tree widget patterns
- Full keyboard navigation support
- Screen reader optimized
- High contrast mode support
- Focus management
- WCAG 2.1 AA compliant

See [ACCESSIBILITY.md](./ACCESSIBILITY.md) for details.

## Performance

Optimized for large datasets:

- Virtualized rendering (only visible nodes in DOM)
- Async data loading support
- Efficient state management
- Debounced search
- Memoized calculations

See [PERFORMANCE.md](./PERFORMANCE.md) for benchmarks.

## Testing

Comprehensive test coverage including:

- Unit tests for utilities and hooks
- Integration tests for components
- Accessibility tests with axe-core
- Visual regression tests with Chromatic

```bash
npm test                 # Run all tests
npm run test:coverage    # View coverage report
npm run a11y:audit       # Accessibility audit
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) file for details

## Support

For issues and questions:

- Open an issue on GitHub
- Check [Known Limitations](./KNOWN_LIMITATIONS.md)
- Review [Documentation Index](./DOCUMENTATION_INDEX.md)

## Project Status

✅ **Production Ready** - All features complete and tested

See [STATUS.md](./STATUS.md) for detailed project status.
