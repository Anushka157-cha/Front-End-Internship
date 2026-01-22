/**
 * Hook for keyboard navigation
 */

import { useCallback } from 'react';
import { TreeNavigationAction } from '../utils/types';
import { FlattenedTreeNode } from '../utils/types';

interface UseKeyboardResult {
  handleKeyDown: (
    event: React.KeyboardEvent,
    currentNodeId: string,
    flatNodes: FlattenedTreeNode[],
    expandedNodes: Set<string>,
    onAction: (action: TreeNavigationAction, nodeId: string) => void
  ) => boolean;
}

export function useKeyboard(): UseKeyboardResult {
  const handleKeyDown = useCallback(
    (
      event: React.KeyboardEvent,
      currentNodeId: string,
      flatNodes: FlattenedTreeNode[],
      expandedNodes: Set<string>,
      onAction: (action: TreeNavigationAction, nodeId: string) => void
    ): boolean => {
      const currentIndex = flatNodes.findIndex((n) => n.id === currentNodeId);
      if (currentIndex === -1) return false;

      const currentNode = flatNodes[currentIndex];
      let handled = false;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < flatNodes.length - 1) {
            const nextNode = flatNodes[currentIndex + 1];
            if (nextNode) {
              onAction(TreeNavigationAction.FOCUS_NEXT, nextNode.id);
              handled = true;
            }
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            const prevNode = flatNodes[currentIndex - 1];
            if (prevNode) {
              onAction(TreeNavigationAction.FOCUS_PREV, prevNode.id);
              handled = true;
            }
          }
          break;

        case 'ArrowRight':
          event.preventDefault();
          if (currentNode && currentNode.children && currentNode.children.length > 0) {
            if (!expandedNodes.has(currentNodeId)) {
              onAction(TreeNavigationAction.OPEN, currentNodeId);
            } else if (currentIndex < flatNodes.length - 1) {
              const nextNode = flatNodes[currentIndex + 1];
              if (nextNode) {
                onAction(TreeNavigationAction.FOCUS_NEXT, nextNode.id);
              }
            }
          }
          handled = true;
          break;

        case 'ArrowLeft':
          event.preventDefault();
          if (expandedNodes.has(currentNodeId)) {
            onAction(TreeNavigationAction.CLOSE, currentNodeId);
          } else if (currentNode && currentNode.parent) {
            onAction(TreeNavigationAction.FOCUS_PARENT, currentNode.parent);
          }
          handled = true;
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (currentNode && currentNode.children && currentNode.children.length > 0) {
            onAction(TreeNavigationAction.TOGGLE, currentNodeId);
          } else {
            onAction(TreeNavigationAction.SELECT, currentNodeId);
          }
          handled = true;
          break;

        case 'Home':
          event.preventDefault();
          const firstNode = flatNodes[0];
          if (firstNode) {
            onAction(TreeNavigationAction.FOCUS_FIRST, firstNode.id);
            handled = true;
          }
          break;

        case 'End':
          event.preventDefault();
          const lastNode = flatNodes[flatNodes.length - 1];
          if (lastNode) {
            onAction(TreeNavigationAction.FOCUS_LAST, lastNode.id);
            handled = true;
          }
          break;
      }

      return handled;
    },
    []
  );

  return { handleKeyDown };
}
