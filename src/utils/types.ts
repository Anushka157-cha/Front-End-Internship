/**
 * Tree data model and type definitions
 */

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  metadata?: Record<string, any>;
  parent?: string;
}

export interface FlattenedTreeNode extends TreeNode {
  level: number;
  parent?: string;
  isExpanded?: boolean;
  ancestors?: string[];
}

export interface SelectionState {
  selected: Set<string>;
  indeterminate: Set<string>;
}

export interface VirtualizationState {
  visibleStart: number;
  visibleEnd: number;
  scrollOffset: number;
  itemHeight: number;
  containerHeight: number;
}

export interface SearchContext {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
}

export interface SearchResult {
  nodeId: string;
  ancestors: TreeNode[];
  node: TreeNode;
  matchedOn: 'label' | 'metadata';
}

export interface TreeLoaderOptions {
  parentId?: string;
  signal?: AbortSignal;
}

export type TreeLoader = (options: TreeLoaderOptions) => Promise<TreeNode[]>;

export interface TreeComboboxProps {
  nodes: TreeNode[];
  loader?: TreeLoader;
  onSelectionChange?: (selected: Set<string>) => void;
  onSearch?: (query: string) => void;
  multiSelect?: boolean;
  virtualized?: boolean;
  itemHeight?: number;
  containerHeight?: number;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export interface KeyboardEvent {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export enum TreeNavigationAction {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  TOGGLE = 'TOGGLE',
  SELECT = 'SELECT',
  FOCUS_NEXT = 'FOCUS_NEXT',
  FOCUS_PREV = 'FOCUS_PREV',
  FOCUS_FIRST = 'FOCUS_FIRST',
  FOCUS_LAST = 'FOCUS_LAST',
  FOCUS_PARENT = 'FOCUS_PARENT',
}
