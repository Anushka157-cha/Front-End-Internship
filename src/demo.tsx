import React from 'react';
import { createRoot } from 'react-dom/client';
import { TreeCombobox } from './components/TreeCombobox/TreeCombobox';
import { TreeNode } from './utils/types';
import './styles/index.css';

const sampleData: TreeNode[] = [
  {
    id: '1',
    label: 'Fruits',
    children: [
      { id: '1-1', label: 'Apple' },
      { id: '1-2', label: 'Banana' },
      { id: '1-3', label: 'Mango' },
      { id: '1-4', label: 'Papaya' },
      { id: '1-5', label: 'Grapes' },
      {
        id: '1-6',
        label: 'Citrus',
        children: [
          { id: '1-6-1', label: 'Orange' },
          { id: '1-6-2', label: 'Lemon' },
          { id: '1-6-3', label: 'Lime' },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Vegetables',
    children: [
      { id: '2-1', label: 'Carrot' },
      { id: '2-2', label: 'Broccoli' },
      { id: '2-3', label: 'Spinach' },
      { id: '2-4', label: 'Tomato' },
      { id: '2-5', label: 'Potato' },
      { id: '2-6', label: 'Brinjal' },
      { id: '2-7', label: 'Onion' },
      { id: '2-8', label: 'Cauliflower' },
      { id: '2-9', label: 'Cabbage' },
    ],
  },
  {
    id: '3',
    label: 'Dairy',
    children: [
      { id: '3-1', label: 'Milk' },
      { id: '3-2', label: 'Cheese' },
      { id: '3-3', label: 'Yogurt' },
      { id: '3-4', label: 'Butter' },
    ],
  },
];

function Demo() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const handleSelectionChange = (selectedSet: Set<string>) => {
    setSelected(selectedSet);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hierarchical Tree Selection
        </h1>
        <p className="text-gray-600 mb-8">
          A scalable, accessible tree selection component with virtualization
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <TreeCombobox
            nodes={sampleData}
            onSelectionChange={handleSelectionChange}
            ariaLabel="Grocery items selector"
            placeholder="Select items..."
          />

          {selected.size > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Selected Items ({selected.size}):
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(selected).map((id) => (
                  <span
                    key={id}
                    className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-medium"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li> Custom virtualization for large datasets</li>
            <li> Full keyboard navigation (Arrow keys, Space, Enter, Esc)</li>
            <li> Accessible with ARIA labels</li>
            <li> Search with context preservation</li>
            <li> Multi-select with indeterminate states</li>
            <li> TypeScript strict mode</li>
          </ul>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            View complete documentation and examples at{' '}
            <a
              href="http://localhost:6006"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storybook (localhost:6006)
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Demo />);
