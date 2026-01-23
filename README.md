# Internship Assignment: Hierarchical Tree Selection Component

**Submitted to:** Uzence  
**Candidate:** [Your Name]  
**Submission Date:** January 2026

## Overview

Built a hierarchical tree selection component for React with focus on performance and accessibility. The component handles large datasets efficiently using virtual scrolling and follows WCAG 2.1 AA standards.

**Live Demo:** [Storybook](https://697214d27903076a7e399f4f-eyatvxdksw.chromatic.com/)

## Features Implemented

### Core Functionality
- ✅ **Hierarchical Tree Structure** - Multi-level nested data rendering
- ✅ **Multi-Select Support** - Individual and branch selection
- ✅ **Search/Filter** - Fast search with context preservation
- ✅ **Expand/Collapse** - Interactive tree navigation
- ✅ **Async Data Loading** - On-demand child loading for scalability

### Performance Optimizations
- ✅ **Virtual Scrolling** - Efficiently handles 50,000+ nodes
- ✅ **Lazy Loading** - Load data only when needed
- ✅ **Debounced Search** - Optimized search performance
- ✅ **Memoization** - Prevents unnecessary re-renders

### Accessibility (WCAG 2.1 AA)
- ✅ **Keyboard Navigation** - Complete keyboard support (Arrow keys, Enter, Escape, Home/End)
- ✅ **Screen Reader Support** - Full ARIA tree implementation
- ✅ **Focus Management** - Clear visual focus indicators
- ✅ **Color Contrast** - WCAG AA compliant colors

### Code Quality
- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Unit Tests** - Comprehensive test coverage with Vitest
- ✅ **Accessibility Tests** - Automated a11y audits with axe-core
- ✅ **Linting & Formatting** - ESLint + Prettier configuration
- ✅ **Component Documentation** - Storybook with all use cases

## Tech Stack

- React 18 with TypeScript (strict mode)
- Vite for dev server and build
- TailwindCSS for styling
- Vitest for testing
- Storybook for component demos
- Chromatic for deployment

## Key Implementation Details

**Virtual Scrolling:** Custom hook that renders only visible nodes. Tested with 50k+ nodes without lag.

**Accessibility:** Used proper ARIA tree pattern - aria-expanded, aria-selected, aria-level. Full keyboard navigation support.

**Selection Logic:** Parent-child sync using recursive traversal. Used Set for O(1) lookups.

**Performance:** Memoized calculations, debounced search (300ms), lazy loading for async data.

## Running the Project

Requirements: Node.js 18+ and npm

```bash
npm install
npm run storybook  # Opens on localhost:6006
```

Or use `npm run dev` for the Vite dev server.

### Available Commands

```bash
# Development
npm run storybook        # View component demos (Recommended!)
npm run dev              # Start Vite dev server

# Testing
npm test                 # Run tests
npm run test:coverage    # Generate coverage report
npm run a11y:audit       # Run accessibility audit

# Build
npm run build            # Production build
npm run build-storybook  # Build Storybook

# Code Quality
npm run lint             # Check code quality
npm run type-check       # TypeScript validation
```

##  Project Structure

```
src/
├── components/
│   ├── TreeCombobox/        # Main component
│   ├── TreeNode/            # Individual tree node
│   ├── SelectionTags/       # Selected items display
│   └── VirtualizedTree/     # Virtual scroll container
├──Project Structure

```
src/
├── components/
│   ├── TreeCombobox/     # Main component
│   ├── TreeNode/         # Individual tree item
│   ├── SelectionTags/    # Shows selected items
│   └── VirtualizedTree/  # Handles virtual scrolling
├── hooks/
│   ├── useTreeData.ts
│   ├── useSelection.ts
│   ├── useKeyboard.ts
│   └── useVirtualization.ts
└── utils/
    ├── treeTraversal.ts  # Tree algorithms
    ├── searchUtils.ts
    └── a11y.ts
```

## Documentation

- [API.md](./API.md) - Props and types reference
- [ACCESSIBILITY.md](./ACCESSIBILITY.md) - Accessibility implementation details (auto-generated from audit script)
- [Storybook](https://697214d27903076a7e399f4f-eyatvxdksw.chromatic.com/) - L
# View coverage report
npm run test:coverage

# Run accessibility audit
npm run a11y:audit
```

##  Code Quality Standards

- **TypeScript Strict Mode** - No `any` types, full type safety
- **ESLint** - Enforced code quality rules
- **Prettier** - Consistent code formatting
- **Component-driven** - Modular, reusable architecture
- **Documented** - Storybook for all components

##  Challenges & Solutions

**1. Performance with Large Data**
- Problem: 10k+ nodes caused lag
- Solution: Virtual scrolling - only 10-20 nodes in DOM at a time

**2. Keyboard Navigation**
- Problem: Focus management across virtualized tree
- Solution: Custom focus system with ARIA attributes

**3. Selection Logic**
- Problem: Parent-child sync (selecting parent should select all children)
- Solution: Recursive traversal with Set for efficient lookups

##
Used Vitest for unit tests and axe-core for a11y testing.

## Challenges Faced
- **Live Demo:** [Storybook Deployment](https://697214d27903076a7e399f4f-eyatvxdksw.chromatic.com/)
- **Source Code:** Check `src/` directory for implementation
- **Tests:** See `src/` for unit tests
