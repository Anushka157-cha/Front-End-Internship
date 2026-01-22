/**
 * Individual tree node component
 */

import React, { useRef, useEffect } from 'react';
import { FlattenedTreeNode } from '../../utils/types';
import { A11y } from '../../utils/a11y';

interface TreeNodeProps {
  node: FlattenedTreeNode;
  isSelected: boolean;
  isIndeterminate: boolean;
  isFocused: boolean;
  isLoading?: boolean;
  onSelect: (nodeId: string, event: React.MouseEvent) => void;
  onToggle: (nodeId: string) => void;
  onFocus: (nodeId: string) => void;
  onKeyDown: (event: React.KeyboardEvent, nodeId: string) => void;
  searchHighlight?: string;
}

export const TreeNode = React.memo(React.forwardRef<HTMLDivElement, TreeNodeProps>(
  ({
    node,
    isSelected,
    isIndeterminate,
    isFocused,
    isLoading,
    onSelect,
    onToggle,
    onFocus,
    onKeyDown,
    searchHighlight,
  }: TreeNodeProps) => {
    const nodeRef = useRef<HTMLDivElement>(null);

    // Focus management
    useEffect(() => {
      if (isFocused && nodeRef.current) {
        nodeRef.current.focus();
      }
    }, [isFocused]);

    const hasChildren = node.children && node.children.length > 0;
    const indentLevel = node.level * 16;
    const ariaLabel = A11y.getNodeLabel(node.label, node.level, node.isExpanded, hasChildren);

    const handleCheckboxChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      // Instant response - no delay
      onSelect(node.id, e as any);
    }, [node.id, onSelect]);

    const handleToggle = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren) {
        onToggle(node.id);
      }
    }, [node.id, hasChildren, onToggle]);

    const highlightLabel = () => {
      if (!searchHighlight) return node.label;

      const parts = node.label.split(new RegExp(`(${searchHighlight})`, 'gi'));
      return parts.map((part: string, i: number) =>
        part.toLowerCase() === searchHighlight?.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      );
    };

    // Ultra-fast visual feedback - no transition delay
    let className =
      'flex items-center h-8 px-md border border-transparent cursor-pointer select-none outline-none';

    if (isFocused) className += ' bg-blue-50 border-primary ring-2 ring-blue-300';
    if (isSelected) className += ' bg-blue-500 text-white font-medium';
    if (isIndeterminate) className += ' bg-blue-300 text-gray-900';
    if (node.disabled) className += ' opacity-50 cursor-not-allowed pointer-events-none';
    else className += ' hover:bg-gray-100 active:bg-blue-400 active:scale-[0.99]';
    if (isLoading) className += ' opacity-80 animate-pulse';

    return (
      <div
        ref={nodeRef}
        className={className}
        role="treeitem"
        aria-label={ariaLabel}
        aria-selected={isSelected || isIndeterminate}
        aria-expanded={hasChildren ? node.isExpanded : undefined}
        aria-disabled={node.disabled}
        aria-level={node.level + 1}
        aria-posinset={0}
        aria-setsize={0}
        tabIndex={isFocused ? 0 : -1}
        onFocus={() => onFocus(node.id)}
        onKeyDown={(e) => onKeyDown(e, node.id)}
        onClick={(e) => onSelect(node.id, e)}
        style={{ paddingLeft: `${indentLevel}px` }}
      >
        {/* Expand/collapse button */}
        {hasChildren && (
          <button
            className="tree-node__toggle"
            onClick={handleToggle}
            aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
            tabIndex={-1}
            type="button"
          >
            {node.isExpanded ? '▼' : '▶'}
          </button>
        )}

        {/* Checkbox - instant visual feedback */}
        <input
          type="checkbox"
          className="tree-node__checkbox cursor-pointer transition-transform duration-75 hover:scale-110 active:scale-95"
          checked={isSelected}
          ref={(input) => {
            if (input) {
              input.indeterminate = isIndeterminate;
            }
          }}
          onChange={handleCheckboxChange}
          disabled={node.disabled}
          tabIndex={-1}
          aria-label={`Select ${node.label}`}
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer'
          }}
        />

        {/* Label */}
        <span className="tree-node__label flex-1 truncate">{highlightLabel()}</span>

        {/* Loading indicator - animated */}
        {isLoading && (
          <span 
            className="tree-node__spinner inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" 
            aria-label="Loading"
            role="status"
          />
        )}
      </div>
    );
  }
), (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isIndeterminate === nextProps.isIndeterminate &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.node.isExpanded === nextProps.node.isExpanded &&
    prevProps.searchHighlight === nextProps.searchHighlight
  );
});

TreeNode.displayName = 'TreeNode';
