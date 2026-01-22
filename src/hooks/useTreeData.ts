/**
 * Handles async loading of tree data
 * Keeps track of what's being loaded and handles errors
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { TreeNode, TreeLoader } from '../utils/types';

interface UseTreeDataResult {
  nodes: TreeNode[];
  loading: boolean;
  error: Error | null;
  loadingParents: Set<string>;
  expandNode: (nodeId: string) => Promise<void>;
  refreshNodes: () => Promise<void>;
}

export function useTreeData(initialNodes: TreeNode[], loader?: TreeLoader): UseTreeDataResult {
  const [nodes, setNodes] = useState<TreeNode[]>(initialNodes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingParents, setLoadingParents] = useState<Set<string>>(new Set());

  // Keep AbortController in ref so we can cancel requests if component unmounts
  const abortControllerRef = useRef<AbortController>(new AbortController());

  const expandNode = useCallback(
    async (nodeId: string) => {
      if (!loader) return;

      // Track which parent is loading so we can show spinner
      setLoadingParents((prev) => new Set([...prev, nodeId]));
      setError(null);

      try {
        const children = await loader({
          parentId: nodeId,
          signal: abortControllerRef.current.signal,
        });

        // Update the tree by finding the parent and adding children to it
        setNodes((prevNodes) => {
          const updateNode = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map((node) => {
              if (node.id === nodeId) {
                return {
                  ...node,
                  children: [...(node.children || []), ...children],
                };
              }
              if (node.children) {
                return {
                  ...node,
                  children: updateNode(node.children),
                };
              }
              return node;
            });
          };

          return updateNode(prevNodes);
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
          console.error('Error loading tree nodes:', err);
        }
      } finally {
        setLoadingParents((prev) => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
      }
    },
    [loader]
  );

  const refreshNodes = useCallback(async () => {
    if (!loader) return;

    setLoading(true);
    setError(null);

    try {
      const rootNodes = await loader({ signal: abortControllerRef.current.signal });
      setNodes(rootNodes);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [loader]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  return {
    nodes,
    loading,
    error,
    loadingParents,
    expandNode,
    refreshNodes,
  };
}
