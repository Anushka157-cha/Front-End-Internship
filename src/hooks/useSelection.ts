// Selection state management for tree component
// Handles the tricky part: indeterminate checkboxes when only some children selected

import { useState, useCallback } from 'react';
import { TreeTraversal } from '../utils/treeTraversal';
import { TreeNode } from '../utils/types';

interface UseSelectionResult {
  selected: Set<string>;
  indeterminate: Set<string>;
  toggleSelection: (nodeId: string, nodes: TreeNode[]) => void;
  setSelected: (nodeId: string, nodes: TreeNode[], select: boolean) => void;
  selectRange: (startId: string, endId: string, flatNodes: any[]) => void;
  clearSelection: () => void;
  getSelectionState: (nodeId: string) => 'selected' | 'indeterminate' | 'none';
}

export function useSelection(): UseSelectionResult {
  const [selected, setSelectedState] = useState<Set<string>>(new Set());
  const [indeterminate, setIndeterminateState] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback(
    (nodeId: string, nodes: TreeNode[]) => {
      const node = TreeTraversal.findNode(nodes, nodeId);
      if (!node) return;

      // Single state update for better performance
      setSelectedState((prev) => {
        const newSelected = new Set(prev);
        const isCurrentlySelected = newSelected.has(nodeId);
        // console.log('toggling:', nodeId, 'currently:', isCurrentlySelected);

        if (isCurrentlySelected) {
          // Remove node + all its children
          newSelected.delete(nodeId);
          if (node.children) {
            const descendants = TreeTraversal.getDescendants(node);
            descendants.forEach((id) => newSelected.delete(id));
          }
        } else {
          // Add node + all its children  
          newSelected.add(nodeId);
          if (node.children) {
            const descendants = TreeTraversal.getDescendants(node);
            descendants.forEach((id) => newSelected.add(id));
          }
        }

        return newSelected;
      });

      // Update parent indeterminate states
      // doing this in RAF to keep selection instant
      requestAnimationFrame(() => {
        const parent = TreeTraversal.getParent(nodes, nodeId);
        if (parent) {
          setIndeterminateState((prevIndeterminate) => {
            const result = new Set(prevIndeterminate);
            const ancestors: TreeNode[] = [];
            let current: TreeNode | null = parent;
            
            while (current) {
              ancestors.push(current);
              current = TreeTraversal.getParent(nodes, current.id);
            }

            setSelectedState((currentSelected) => {
              for (const ancestor of ancestors) {
                const isIndeterminate = TreeTraversal.calculateIndeterminate(ancestor, currentSelected);
                if (isIndeterminate) {
                  result.add(ancestor.id);
                } else {
                  result.delete(ancestor.id);
                }
              }
              return currentSelected;
            });

            return result;
          });
        }
      });
    },
    []
  );

  const setSelected = useCallback((nodeId: string, nodes: TreeNode[], select: boolean) => {
    setSelectedState((prev) => {
      const newSelected = new Set(prev);
      const node = TreeTraversal.findNode(nodes, nodeId);

      if (!node) return newSelected;

      if (select) {
        newSelected.add(nodeId);
        const descendants = TreeTraversal.getDescendants(node);
        descendants.forEach((id) => newSelected.add(id));
      } else {
        newSelected.delete(nodeId);
        const descendants = TreeTraversal.getDescendants(node);
        descendants.forEach((id) => newSelected.delete(id));
      }

      return newSelected;
    });
  }, []);

  const selectRange = useCallback((startId: string, endId: string, flatNodes: any[]) => {
    const startIndex = flatNodes.findIndex((n) => n.id === startId);
    const endIndex = flatNodes.findIndex((n) => n.id === endId);

    if (startIndex === -1 || endIndex === -1) return;

    const [min, max] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

    setSelectedState((prev) => {
      const newSelected = new Set(prev);
      for (let i = min; i <= max; i++) {
        const node = flatNodes[i];
        if (node) {
          newSelected.add(node.id);
        }
      }
      return newSelected;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedState(new Set());
    setIndeterminateState(new Set());
  }, []);

  const getSelectionState = useCallback(
    (nodeId: string): 'selected' | 'indeterminate' | 'none' => {
      if (selected.has(nodeId)) return 'selected';
      if (indeterminate.has(nodeId)) return 'indeterminate';
      return 'none';
    },
    [selected, indeterminate]
  );

  return {
    selected,
    indeterminate,
    toggleSelection,
    setSelected,
    selectRange,
    clearSelection,
    getSelectionState,
  };
}
