/**
 * Tag display for selected items
 */

import React from 'react';
import { TreeNode } from '../../utils/types';

interface SelectionTagsProps {
  selectedNodes: TreeNode[];
  onRemove: (nodeId: string) => void;
  disabled?: boolean;
  maxDisplay?: number;
}

export const SelectionTags: React.FC<SelectionTagsProps> = ({
  selectedNodes,
  onRemove,
  disabled = false,
  maxDisplay = 3,
}) => {
  const displayNodes = selectedNodes.slice(0, maxDisplay);
  const hiddenCount = Math.max(0, selectedNodes.length - maxDisplay);

  return (
    <div className="flex flex-wrap items-center gap-sm">
      {displayNodes.map((node: any) => (
        <div
          key={node.id}
          className={`inline-flex items-center gap-1.5 break-words rounded-sm border border-indigo-300 bg-indigo-100 px-2 py-1 text-[13px] text-indigo-900 ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
          role="option"
          aria-selected="true"
        >
          <span className="flex-1">{node.label}</span>
          {!disabled && (
            <button
              className="flex h-4 w-4 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-sm text-current transition-opacity hover:opacity-70"
              onClick={() => onRemove(node.id)}
              aria-label={`Remove ${node.label}`}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {hiddenCount > 0 && (
        <div
          className="inline-flex cursor-default items-center gap-1.5 rounded-sm border border-gray-300 bg-gray-100 px-2 py-1 text-xs text-gray-600"
          role="status"
          aria-label={`${hiddenCount} more items selected`}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};

SelectionTags.displayName = 'SelectionTags';
