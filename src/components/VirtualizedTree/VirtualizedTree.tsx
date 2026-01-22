/**
 * Virtualized tree rendering component
 */

import React, { useRef, useEffect } from 'react';
import { FlattenedTreeNode } from '../../utils/types';
import { TreeNode } from '../TreeNode/TreeNode';

interface VirtualizedTreeProps {
  items: FlattenedTreeNode[];
  visibleStart: number;
  visibleEnd: number;
  itemHeight: number;
  containerHeight: number;
  scrollOffset: number;
  selectedNodes: Set<string>;
  indeterminateNodes: Set<string>;
  loadingParents: Set<string>;
  focusedNodeId: string | null;
  expandedNodes: Set<string>;
  onScroll: (offset: number) => void;
  onNodeSelect: (nodeId: string, event: React.MouseEvent) => void;
  onNodeToggle: (nodeId: string) => void;
  onNodeFocus: (nodeId: string) => void;
  onNodeKeyDown: (event: React.KeyboardEvent, nodeId: string) => void;
  searchHighlight?: string;
}

export const VirtualizedTree = React.memo(React.forwardRef<HTMLDivElement, VirtualizedTreeProps>(
  (
    {
      items,
      visibleStart,
      visibleEnd,
      itemHeight,
      containerHeight,
      scrollOffset,
      selectedNodes,
      indeterminateNodes,
      loadingParents,
      focusedNodeId,
      onScroll,
      onNodeSelect,
      onNodeToggle,
      onNodeFocus,
      onNodeKeyDown,
      searchHighlight,
    }: VirtualizedTreeProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const totalHeight = items.length * itemHeight;
    const visibleNodes = items.slice(visibleStart, visibleEnd);
    const offsetY = visibleStart * itemHeight;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      onScroll(target.scrollTop);
    };

    // Restore scroll position when items change
    useEffect(() => {
      if (scrollContainerRef.current && scrollOffset > 0) {
        scrollContainerRef.current.scrollTop = scrollOffset;
      }
    }, [items, scrollOffset]);

    return (
      <div
        ref={ref}
        className="virtualized-tree"
        role="tree"
        aria-label="Hierarchical tree selection"
      >
        <div
          ref={scrollContainerRef}
          className="virtualized-tree__container"
          style={{
            height: `${containerHeight}px`,
            overflow: 'auto',
            position: 'relative',
          }}
          onScroll={handleScroll}
        >
          {/* Total height spacer for scroll */}
          <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
            {/* Visible nodes */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${offsetY}px)`,
              }}
            >
              {visibleNodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  isSelected={selectedNodes.has(node.id)}
                  isIndeterminate={indeterminateNodes.has(node.id)}
                  isFocused={focusedNodeId === node.id}
                  isLoading={loadingParents.has(node.id)}
                  onSelect={onNodeSelect}
                  onToggle={onNodeToggle}
                  onFocus={onNodeFocus}
                  onKeyDown={onNodeKeyDown}
                  searchHighlight={searchHighlight}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
), (prevProps, nextProps) => {
  // Memoization comparison for performance
  return (
    prevProps.items.length === nextProps.items.length &&
    prevProps.visibleStart === nextProps.visibleStart &&
    prevProps.visibleEnd === nextProps.visibleEnd &&
    prevProps.scrollOffset === nextProps.scrollOffset &&
    prevProps.focusedNodeId === nextProps.focusedNodeId &&
    prevProps.selectedNodes.size === nextProps.selectedNodes.size &&
    prevProps.indeterminateNodes.size === nextProps.indeterminateNodes.size &&
    prevProps.searchHighlight === nextProps.searchHighlight
  );
});

VirtualizedTree.displayName = 'VirtualizedTree';
