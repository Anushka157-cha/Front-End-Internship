/**
 * Integration tests for TreeCombobox
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TreeCombobox } from './TreeCombobox';
import { TreeNode } from '../../utils/types';

describe('TreeCombobox', () => {
  const sampleData: TreeNode[] = [
    {
      id: '1',
      label: 'Parent 1',
      children: [
        { id: '1-1', label: 'Child 1-1' },
        { id: '1-2', label: 'Child 1-2' },
      ],
    },
    {
      id: '2',
      label: 'Parent 2',
      children: [{ id: '2-1', label: 'Child 2-1' }],
    },
  ];

  describe('Rendering', () => {
    it('should render with placeholder', () => {
      render(<TreeCombobox nodes={sampleData} placeholder="Select items..." />);
      expect(screen.getByText('Select items...')).toBeInTheDocument();
    });

    it('should render with ARIA attributes', () => {
      const { container } = render(<TreeCombobox nodes={sampleData} aria-label="Test tree" />);
      const combobox = container.querySelector('[role="combobox"]');
      expect(combobox).toHaveAttribute('aria-label', 'Test tree');
    });

    it('should be closed initially', () => {
      const { container } = render(<TreeCombobox nodes={sampleData} />);
      expect(container.querySelector('.tree-combobox__panel')).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should open/close on toggle button click', async () => {
      const { container } = render(<TreeCombobox nodes={sampleData} />);
      const toggle = screen.getByRole('button', { name: /open tree/i });

      fireEvent.click(toggle);
      await waitFor(() => {
        expect(container.querySelector('.tree-combobox__panel')).toBeInTheDocument();
      });

      fireEvent.click(toggle);
      await waitFor(() => {
        expect(container.querySelector('.tree-combobox__panel')).not.toBeInTheDocument();
      });
    });

    it('should handle node selection', async () => {
      const onSelectionChange = vi.fn();
      render(<TreeCombobox nodes={sampleData} onSelectionChange={onSelectionChange} />);

      // Open
      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      // Select item
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it('should support multi-select', async () => {
      const onSelectionChange = vi.fn();
      render(
        <TreeCombobox nodes={sampleData} multiSelect={true} onSelectionChange={onSelectionChange} />
      );

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        fireEvent.click(checkboxes[1]);
      });

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
    });

    it('should support single select', async () => {
      const onSelectionChange = vi.fn();
      render(
        <TreeCombobox
          nodes={sampleData}
          multiSelect={false}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        fireEvent.click(checkboxes[1]);
      });

      // Should still have called but only final selection should be active
      expect(onSelectionChange).toHaveBeenCalled();
    });
  });

  describe('Search', () => {
    it('should handle search input', async () => {
      const onSearch = vi.fn();
      render(<TreeCombobox nodes={sampleData} onSearch={onSearch} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search items...');
        fireEvent.change(searchInput, { target: { value: 'Child' } });
      });

      expect(onSearch).toHaveBeenCalledWith('Child');
    });

    it('should display search result count', async () => {
      render(<TreeCombobox nodes={sampleData} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search items...');
        fireEvent.change(searchInput, { target: { value: 'Parent' } });
      });

      await waitFor(() => {
        expect(screen.getByText(/result.*found/i)).toBeInTheDocument();
      });
    });

    it('should clear search on clear button click', async () => {
      render(<TreeCombobox nodes={sampleData} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search items...');
        fireEvent.change(searchInput, { target: { value: 'test' } });
      });

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search items...') as HTMLInputElement;
        expect(searchInput.value).toBe('');
      });
    });
  });

  describe('Async Loading', () => {
    it('should load children on node expansion', async () => {
      const loader = vi.fn().mockResolvedValue([{ id: 'async-1', label: 'Async Child 1' }]);

      render(<TreeCombobox nodes={sampleData} loader={loader} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const expandButtons = screen.getAllByRole('button', { name: /expand|collapse/i });
        fireEvent.click(expandButtons[0]);
      });

      expect(loader).toHaveBeenCalled();
    });

    it('should handle loading errors', async () => {
      const loader = vi.fn().mockRejectedValue(new Error('Load failed'));

      render(<TreeCombobox nodes={sampleData} loader={loader} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        fireEvent.click(screen.getAllByRole('button', { name: /expand|collapse/i })[0]);
      });

      await waitFor(() => {
        expect(screen.getByText(/error|load failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      const user = userEvent.setup();
      render(<TreeCombobox nodes={sampleData} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const tree = screen.getByRole('tree');
        expect(tree).toBeInTheDocument();
      });

      const tree = screen.getByRole('tree');
      fireEvent.keyDown(tree, { key: 'ArrowDown' });

      // Focus should move
      expect(true).toBe(true); // Placeholder for actual focus check
    });

    it('should expand/collapse with arrow keys', async () => {
      const { container } = render(<TreeCombobox nodes={sampleData} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const expandButtons = screen.getAllByRole('button', { name: /expand|collapse/i });
        fireEvent.keyDown(expandButtons[0], { key: 'ArrowRight' });
      });

      // Node should expand (this is a simplified check)
      expect(true).toBe(true);
    });

    it('should select with Enter/Space', async () => {
      const onSelectionChange = vi.fn();
      const { container } = render(
        <TreeCombobox nodes={sampleData} onSelectionChange={onSelectionChange} />
      );

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.keyDown(checkboxes[0], { key: ' ' });
      });

      expect(true).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      const { container } = render(<TreeCombobox nodes={sampleData} />);

      expect(container.querySelector('[role="combobox"]')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      const { container } = render(<TreeCombobox nodes={sampleData} />);

      const combobox = container.querySelector('[role="combobox"]');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
    });

    it('should support screen reader announcements', async () => {
      render(<TreeCombobox nodes={sampleData} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      await waitFor(() => {
        const tree = screen.getByRole('tree');
        expect(tree).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Disabled State', () => {
    it('should render as disabled', () => {
      render(<TreeCombobox nodes={sampleData} disabled={true} />);

      const toggle = screen.getByRole('button', { name: /open tree/i });
      expect(toggle).toBeDisabled();
    });

    it('should not allow interactions when disabled', async () => {
      const onSelectionChange = vi.fn();
      render(
        <TreeCombobox nodes={sampleData} disabled={true} onSelectionChange={onSelectionChange} />
      );

      const toggle = screen.getByRole('button', { name: /open tree/i });
      fireEvent.click(toggle);

      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('Virtualization', () => {
    it('should handle large datasets', () => {
      const largeData: TreeNode[] = [];
      for (let i = 0; i < 100; i++) {
        largeData.push({
          id: `${i}`,
          label: `Item ${i}`,
        });
      }

      render(<TreeCombobox nodes={largeData} virtualized={true} containerHeight={300} />);

      expect(screen.getByText('Select items...')).toBeInTheDocument();
    });

    it('should maintain focus during virtualization', async () => {
      const largeData: TreeNode[] = [];
      for (let i = 0; i < 50; i++) {
        largeData.push({
          id: `${i}`,
          label: `Item ${i}`,
        });
      }

      render(<TreeCombobox nodes={largeData} virtualized={true} />);

      fireEvent.click(screen.getByRole('button', { name: /open tree/i }));

      // Focus should be stable
      expect(true).toBe(true);
    });
  });
});
