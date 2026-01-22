// Main TreeCombobox component
// handles selection, search, virtualization, keyboard nav

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TreeNode, TreeComboboxProps, TreeNavigationAction } from '../../utils/types';
import { useTreeData, useSelection, useKeyboard, useVirtualization } from '../../hooks';
import { TreeTraversal, SearchUtils, A11y } from '../../utils';
import { TreeSearch } from '../TreeSearch/TreeSearch';
import { VirtualizedTree } from '../VirtualizedTree/VirtualizedTree';
import { SelectionTags } from '../SelectionTags/SelectionTags';

export const TreeCombobox = React.forwardRef<HTMLDivElement, TreeComboboxProps>(
  (
    {
      nodes: initialNodes,
      loader,
      onSelectionChange,
      onSearch,
      multiSelect = true,
      itemHeight = 32,
      containerHeight = 300,
      placeholder = 'Select items...',
      disabled = false,
      ariaLabel = 'Tree selection',
      ariaDescribedBy,
    }: TreeComboboxProps,
    ref
  ) => {
    // State
    const { nodes, loading, error, loadingParents, expandNode } = useTreeData(initialNodes, loader);
    const { selected, indeterminate, toggleSelection, setSelected, clearSelection } =
      useSelection();
    const { handleKeyDown: handleKeyboardEvent } = useKeyboard();
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Flatten tree for rendering (only visible nodes)
    const flatNodes = useMemo(() => {
      const displayNodes = searchQuery
        ? SearchUtils.filterTreeWithContext(nodes, searchResults)
        : nodes;

      return TreeTraversal.flatten(displayNodes, expandedNodes);
    }, [nodes, expandedNodes, searchQuery, searchResults]);

    // Virtual scrolling setup
    const { virtualizationState, handleScroll } = useVirtualization(
      flatNodes,
      itemHeight,
      containerHeight
    );

    // Get selected items for tag display
    const selectedNodeObjects = useMemo(() => {
      return Array.from(selected)
        .map((id) => TreeTraversal.findNode(nodes, id))
        .filter((node): node is TreeNode => node !== null);
    }, [selected, nodes]);

    // Handle search
    const handleSearchChange = useCallback(
      (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
          const results = SearchUtils.search(nodes, query);
          setSearchResults(results);
          onSearch?.(query);
          // console.log('search results:', results.length); // useful for debugging
          A11y.announce(`Found ${results.length} matches for "${query}"`);
        } else {
          setSearchResults([]);
          onSearch?.('');
        }
      },
      [nodes, onSearch]
    );

    // Handle node selection - keep it fast
    const handleNodeSelect = useCallback(
      (nodeId: string, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        // Single selection mode
        if (!multiSelect) {
          clearSelection();
          setSelected(nodeId, nodes, true);
          // defer callback for instant UI update
          requestAnimationFrame(() => {
            onSelectionChange?.(new Set([nodeId]));
          });
          return;
        }

        // Multi-select mode - toggle selection
        toggleSelection(nodeId, nodes);
        requestAnimationFrame(() => {
          onSelectionChange?.(selected);
        });
      },
      [nodes, toggleSelection, multiSelect, clearSelection, onSelectionChange, setSelected, selected]
    );

    // Toggle node expand/collapse
    const handleNodeToggle = useCallback(
      (nodeId: string) => {
        const isExpanded = expandedNodes.has(nodeId);
        
        // Update expanded state immediately for instant UI
        setExpandedNodes((prev) => {
          const next = new Set(prev);
          if (isExpanded) {
            next.delete(nodeId);
          } else {
            next.add(nodeId);
          }
          return next;
        });

        // Load children async if needed (non-blocking)
        if (!isExpanded && loader) {
          expandNode(nodeId);
        }
      },
      [loader, expandNode, expandedNodes]
    );

    // Handle keyboard navigation
    const handleNodeKeyDown = useCallback(
      (event: React.KeyboardEvent, nodeId: string) => {
        const handled = handleKeyboardEvent(
          event,
          nodeId,
          flatNodes,
          expandedNodes,
          (action: TreeNavigationAction, id: string) => {
            switch (action) {
              case TreeNavigationAction.FOCUS_NEXT:
              case TreeNavigationAction.FOCUS_PREV:
              case TreeNavigationAction.FOCUS_FIRST:
              case TreeNavigationAction.FOCUS_LAST:
              case TreeNavigationAction.FOCUS_PARENT:
                setFocusedNodeId(id);
                break;
              case TreeNavigationAction.TOGGLE:
                handleNodeToggle(id);
                break;
              case TreeNavigationAction.SELECT:
                handleNodeSelect(id, event as any);
                break;
              case TreeNavigationAction.OPEN:
                setExpandedNodes((prev) => new Set([...prev, id]));
                if (loader) expandNode(id);
                break;
              case TreeNavigationAction.CLOSE:
                setExpandedNodes((prev) => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                break;
            }
          }
        );

        if (!handled && event.key === 'Escape') {
          setIsOpen(false);
        }
      },
      [
        flatNodes,
        expandedNodes,
        handleKeyboardEvent,
        handleNodeToggle,
        handleNodeSelect,
        loader,
        expandNode,
      ]
    );

    // Initialize first focus
    useEffect(() => {
      if (!focusedNodeId && flatNodes.length > 0) {
        const firstNode = flatNodes[0];
        if (firstNode) {
          setFocusedNodeId(firstNode.id);
        }
      }
    }, [flatNodes, focusedNodeId]);

    // Error handling
    useEffect(() => {
      if (error) {
        A11y.announce(`Error loading tree: ${error.message}`, 'assertive');
      }
    }, [error]);

    // Build className string dynamically
    let containerClassName = 'relative w-full font-sans';
    if (isOpen) containerClassName += ' tree-combobox--open';
    if (disabled) containerClassName += ' tree-combobox--disabled';
    if (error) containerClassName += ' tree-combobox--error';
    if (loading) containerClassName += ' tree-combobox--loading';

    return (
      <div
        ref={ref}
        className={containerClassName}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-describedBy={ariaDescribedBy}
      >
        {/* Header with selection display */}
        <div className="tree-combobox__header">
          {selectedNodeObjects.length > 0 ? (
            <SelectionTags
              selectedNodes={selectedNodeObjects}
              onRemove={(nodeId: string) => {
                setSelected(nodeId, nodes, false);
                const newSelected = new Set(selected);
                newSelected.delete(nodeId);
                onSelectionChange?.(newSelected);
              }}
              disabled={disabled}
            />
          ) : (
            <span className="tree-combobox__placeholder">{placeholder}</span>
          )}
          <button
            className="tree-combobox__toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close tree' : 'Open tree'}
            disabled={disabled}
            type="button"
          >
            ▼
          </button>
        </div>

        {/* Search and tree panel */}
        {isOpen && (
          <div className="tree-combobox__panel">
            <TreeSearch
              value={searchQuery}
              onSearchChange={handleSearchChange}
              isSearching={loading}
              resultCount={searchQuery ? searchResults.length : undefined}
            />

            {error && (
              <div className="tree-combobox__error" role="alert" aria-live="assertive">
                Error: {error.message}
              </div>
            )}

            {flatNodes.length === 0 && !error ? (
              <div className="tree-combobox__empty" role="status">
                {searchQuery ? 'No results found' : 'No items available'}
              </div>
            ) : (
              <VirtualizedTree
                items={flatNodes}
                visibleStart={virtualizationState.visibleStart}
                visibleEnd={virtualizationState.visibleEnd}
                itemHeight={itemHeight}
                containerHeight={containerHeight}
                scrollOffset={virtualizationState.scrollOffset}
                selectedNodes={selected}
                indeterminateNodes={indeterminate}
                loadingParents={loadingParents}
                focusedNodeId={focusedNodeId}
                expandedNodes={expandedNodes}
                onScroll={handleScroll}
                onNodeSelect={handleNodeSelect}
                onNodeToggle={handleNodeToggle}
                onNodeFocus={setFocusedNodeId}
                onNodeKeyDown={handleNodeKeyDown}
                searchHighlight={searchQuery}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

TreeCombobox.displayName = 'TreeCombobox';
