# TreeCombobox API

Component props and usage examples.

## Props

### TreeComboboxProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `nodes` | `TreeNode[]` | Yes | - | Array of root tree nodes |
| `loader` | `TreeLoader` | No | undefined | Async function to load child nodes |
| `onSelectionChange` | `(selected: Set<string>) => void` | No | undefined | Callback when selection changes |
| `onSearch` | `(query: string) => void` | No | undefined | Callback when search query changes |
| `multiSelect` | `boolean` | No | `true` | Enable multi-select mode |
| `virtualized` | `boolean` | No | `true` | Enable virtualized rendering |
| `itemHeight` | `number` | No | `32` | Height of each tree item in pixels |
| `containerHeight` | `number` | No | `300` | Height of the scrollable container |
| `placeholder` | `string` | No | `'Select items...'` | Placeholder text |
| `disabled` | `boolean` | No | `false` | Disable the component |
| `aria-label` | `string` | No | `'Tree selection'` | ARIA label for accessibility |
| `ariaDescribedBy` | `string` | No | undefined | ID of element describing the component |

## Types

### TreeNode

```typescript
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  metadata?: Record<string, any>;
  parent?: string;
}
```

### TreeLoader

```typescript
type TreeLoader = (options: TreeLoaderOptions) => Promise<TreeNode[]>;

interface TreeLoaderOptions {
  parentId?: string;
  signal?: AbortSignal;
}
```

## Usage

```tsx
import { TreeCombobox } from './components';

const data = [
  {
    id: '1',
    label: 'Parent 1',
    children: [
      { id: '1-1', label: 'Child 1' },
      { id: '1-2', label: 'Child 2' },
    ],
  },
];

function App() {
  return (
    <TreeCombobox
      nodes={data}
      onSelectionChange={(selected) => console.log(selected)}
    />
  );
}
```

## Async Data

```tsx
const loader = async ({ parentId }) => {
  const res = await fetch(`/api/nodes?parent=${parentId}`);
  return res.json();
};

<TreeCombobox nodes={data} loader={loader} />
```

## Single Select Mode

```tsx
<TreeCombobox
  nodes={data}
  multiSelect={false}
  placeholder="Select one item..."
/>
```

## Search Functionality

```tsx
<TreeCombobox
  nodes={data}
  onSearch={(query) => {
    console.log('Searching for:', query);
    // Optional: Send to analytics, etc.
  }}
/>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Down | Move focus to next item |
| Arrow Up | Move focus to previous item |
| Arrow Right | Expand node (if collapsed) or move to first child |
| Arrow Left | Collapse node (if expanded) or move to parent |
| Enter | Toggle expansion or select item |
| Space | Select/deselect item |
| Home | Move to first item |
| End | Move to last item |
| Escape | Close dropdown |

## Accessibility Features

- Full keyboard navigation support
- ARIA roles and attributes
- Screen reader announcements for:
  - Search results
  - Loading states
  - Selection changes
  - Errors
- High contrast mode support
- Focus indicators on all interactive elements
- Semantic HTML structure

## Performance

### Virtualization

For large datasets (100+ items), virtualization is enabled by default:

```tsx
<TreeCombobox
  nodes={largeDataset}
  virtualized={true}
  itemHeight={32}
  containerHeight={400}
/>
```

### Best Practices

1. **Memoize callbacks** to prevent unnecessary re-renders:
   ```tsx
   const handleSelectionChange = useCallback((selected: Set<string>) => {
     // Handle selection
   }, []);
   ```

2. **Lazy load children** for deep hierarchies:
   ```tsx
   const loader: TreeLoader = async ({ parentId }) => {
     // Only load children when parent is expanded
   };
   ```

3. **Limit initial tree depth** for better initial render performance

## Error Handling

```tsx
const errorProneLoader: TreeLoader = async ({ parentId }) => {
  try {
    return await fetchNodes(parentId);
  } catch (error) {
    // Error will be displayed in UI
    throw new Error('Failed to load nodes');
  }
};

<TreeCombobox
  nodes={data}
  loader={errorProneLoader}
/>
```

## Styling

The component uses Tailwind CSS with design tokens. Customize via CSS variables:

```css
:root {
  --color-primary: #0066cc;
  --color-primary-hover: #0052a3;
  --color-text: #1f2937;
  --spacing-md: 12px;
  --radius-md: 6px;
}
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TreeCombobox } from './TreeCombobox';

test('selects item on click', async () => {
  const handleChange = vi.fn();
  render(
    <TreeCombobox
      nodes={testData}
      onSelectionChange={handleChange}
    />
  );

  // Open dropdown
  const toggle = screen.getByRole('button', { name: /open tree/i });
  await userEvent.click(toggle);

  // Select item
  const checkbox = screen.getAllByRole('checkbox')[0];
  await userEvent.click(checkbox);

  expect(handleChange).toHaveBeenCalled();
});
```

## Migration Guide

### From react-select

```tsx
// Before (react-select)
<Select
  options={options}
  isMulti
  onChange={handleChange}
/>

// After (TreeCombobox)
<TreeCombobox
  nodes={treeData}
  multiSelect={true}
  onSelectionChange={handleChange}
/>
```

### From MUI TreeView

```tsx
// Before (MUI)
<TreeView>
  <TreeItem nodeId="1" label="Parent" />
</TreeView>

// After (TreeCombobox)
<TreeCombobox
  nodes={[{ id: '1', label: 'Parent', children: [] }]}
/>
```

## Advanced Usage

### Custom Metadata

```tsx
const nodesWithMetadata: TreeNode[] = [
  {
    id: '1',
    label: 'Project A',
    metadata: {
      type: 'project',
      status: 'active',
      owner: 'team@example.com',
    },
  },
];

<TreeCombobox nodes={nodesWithMetadata} />
```

### Programmatic Control

```tsx
function ControlledTree() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <>
      <button onClick={() => setSelected(new Set(['1', '2']))}>
        Select items 1 and 2
      </button>
      <TreeCombobox
        nodes={data}
        onSelectionChange={setSelected}
      />
    </>
  );
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT
