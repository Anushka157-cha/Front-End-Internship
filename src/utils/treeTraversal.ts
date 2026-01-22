// Tree utility functions - traversal, flattening, searching etc

import { TreeNode, FlattenedTreeNode } from './types';

export class TreeTraversal {
  // Converts tree to flat array for virtual scrolling
  // only includes expanded nodes
  static flatten(
    nodes: TreeNode[],
    expanded: Set<string> = new Set(),
    parentId: string | undefined = undefined,
    level = 0,
    ancestors: string[] = []
  ): FlattenedTreeNode[] {
    const result: FlattenedTreeNode[] = [];

    for (const node of nodes) {
      // Add current node with metadata
      const flatNode: FlattenedTreeNode = {
        ...node,
        level,
        parent: parentId,
        isExpanded: expanded.has(node.id),
        ancestors,
      };
      result.push(flatNode);

      // Recursively add children if node is expanded
      if (node.children && expanded.has(node.id)) {
        const childrenFlat = this.flatten(node.children, expanded, node.id, level + 1, [
          ...ancestors,
          node.id,
        ]);
        result.push(...childrenFlat);
      }
    }

    return result;
  }

  // Simple DFS to find node by ID
  static findNode(nodes: TreeNode[], id: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNode(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  // Returns array of parent nodes from root to target
  static getAncestors(nodes: TreeNode[], targetId: string, ancestors: TreeNode[] = []): TreeNode[] {
    for (const node of nodes) {
      if (node.id === targetId) {
        return ancestors;
      }
      if (node.children) {
        const found = this.getAncestors(node.children, targetId, [...ancestors, node]);
        if (found.length > 0 || this.findNode(node.children, targetId)) {
          return found;
        }
      }
    }
    return [];
  }

  /**
   * Get all children IDs recursively
   */
  static getDescendants(node: TreeNode): string[] {
    const descendants: string[] = [];

    const traverse = (n: TreeNode) => {
      if (n.children) {
        for (const child of n.children) {
          descendants.push(child.id);
          traverse(child);
        }
      }
    };

    traverse(node);
    return descendants;
  }

  /**
   * Check if a node is descendant of another
   */
  static isDescendant(nodes: TreeNode[], potentialChild: string, potentialParent: string): boolean {
    const parent = this.findNode(nodes, potentialParent);
    if (!parent) return false;

    const descendants = this.getDescendants(parent);
    return descendants.includes(potentialChild);
  }

  /**
   * Get parent node
   */
  static getParent(nodes: TreeNode[], childId: string): TreeNode | null {
    for (const node of nodes) {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === childId) {
            return node;
          }
        }
        const found = this.getParent(node.children, childId);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Calculate indeterminate state for a node
   */
  static calculateIndeterminate(node: TreeNode, selected: Set<string>): boolean {
    if (!node.children || node.children.length === 0) {
      return false;
    }

    let selectedCount = 0;
    let totalCount = 0;

    const countSelected = (n: TreeNode) => {
      totalCount++;
      if (selected.has(n.id)) {
        selectedCount++;
      }
      if (n.children) {
        n.children.forEach(countSelected);
      }
    };

    node.children.forEach(countSelected);

    return selectedCount > 0 && selectedCount < totalCount;
  }
}
