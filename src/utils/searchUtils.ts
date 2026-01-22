// Search utilities for tree filtering
// wrote this manually - can't use fuse.js or other search libs

import { TreeNode, SearchResult } from './types';

export class SearchUtils {
  // Search through tree and return matches
  // stops at 1000 results so UI doesn't freeze with massive trees
  static search(
    nodes: TreeNode[], 
    query: string, 
    includeMetadata = true, 
    maxResults = 1000
  ): SearchResult[] {
    if (!query.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    const traverse = (node: TreeNode, parentAncestors: TreeNode[] = []): boolean => {
      // early exit if we have enough results already
      if (results.length >= maxResults) return true;

      const ancestors = [...parentAncestors];

      // Check label match
      if (node.label.toLowerCase().includes(lowerQuery)) {
        results.push({
          nodeId: node.id,
          node,
          ancestors,
          matchedOn: 'label',
        });
      }

      // Also check metadata if present
      if (includeMetadata && node.metadata) {
        const metadataStr = JSON.stringify(node.metadata).toLowerCase();
        if (metadataStr.includes(lowerQuery)) {
          // skip if already matched on label (no duplicates)
          if (!results.some((r) => r.nodeId === node.id && r.matchedOn === 'label')) {
            results.push({
              nodeId: node.id,
              node,
              ancestors,
              matchedOn: 'metadata',
            });
          }
        }
      }

      // Recurse children
      if (node.children) {
        for (const child of node.children) {
          const shouldStop = traverse(child, [...ancestors, node]);
          if (shouldStop) return true;
        }
      }

      return false;
    };

    for (const node of nodes) {
      const shouldStop = traverse(node);
      if (shouldStop) break;
    }

    return results;
  }

  // Filter tree to show matched nodes + their parent path
  // needed for search results to make sense in tree context
  static filterTreeWithContext(nodes: TreeNode[], searchResults: SearchResult[]): TreeNode[] {
    if (searchResults.length === 0) {
      return nodes;
    }

    const matchedIds = new Set(searchResults.map((r) => r.nodeId));
    const ancestorIds = new Set<string>();

    // Collect all ancestor IDs
    for (const result of searchResults) {
      for (const ancestor of result.ancestors) {
        ancestorIds.add(ancestor.id);
      }
    }

    const filterNodes = (nodeList: TreeNode[]): TreeNode[] => {
      return nodeList
        .filter((node) => matchedIds.has(node.id) || ancestorIds.has(node.id))
        .map((node) => ({
          ...node,
          children: node.children ? filterNodes(node.children) : undefined,
        }));
    };

    return filterNodes(nodes);
  }

  /**
   * Find matching nodes with full ancestor chain
   */
  static findMatchingNodesWithAncestors(
    nodes: TreeNode[],
    query: string
  ): { matches: TreeNode[]; ancestors: Set<string> } {
    const results = this.search(nodes, query);
    const matches = results.map((r) => r.node);
    const ancestors = new Set<string>();

    for (const result of results) {
      for (const ancestor of result.ancestors) {
        ancestors.add(ancestor.id);
      }
    }

    return { matches, ancestors };
  }
}
