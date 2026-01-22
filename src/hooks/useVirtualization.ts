// Virtualization hook - only renders visible items for performance
// Had to write this myself since can't use react-window or tanstack-virtual

import { useState, useCallback, useEffect, useRef } from 'react';
import { VirtualizationState } from '../utils/types';
import { FlattenedTreeNode } from '../utils/types';

interface UseVirtualizationResult {
  virtualizationState: VirtualizationState;
  visibleNodes: FlattenedTreeNode[];
  handleScroll: (scrollOffset: number) => void;
  setContainerDimensions: (height: number) => void;
}

export function useVirtualization(
  flatNodes: FlattenedTreeNode[],
  itemHeight: number = 32,
  containerHeight: number = 400
): UseVirtualizationResult {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [containerHeightState, setContainerHeightState] = useState(containerHeight);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Buffer zone - render extra items so user doesn't see white space when scrolling fast
  // tried 3 items but still saw flicker, 5 works well
  const BUFFER = 5;
  const startIdx = Math.max(0, Math.floor(scrollOffset / itemHeight) - BUFFER);
  const endIdx = Math.min(
    flatNodes.length,
    Math.ceil((scrollOffset + containerHeightState) / itemHeight) + BUFFER
  );

  const virtualizationState: VirtualizationState = {
    visibleStart: startIdx,
    visibleEnd: endIdx,
    scrollOffset,
    itemHeight,
    containerHeight: containerHeightState,
  };

  const visibleNodes = flatNodes.slice(startIdx, endIdx);

  const handleScroll = useCallback((offset: number) => {
    setScrollOffset(offset);
    // console.log('scroll offset:', offset); // helpful for debugging scroll issues

    // Clear previous timeout if still scrolling
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // TODO: maybe add data prefetching here for smoother UX?
    // tried it but caused weird re-renders, need to revisit
    scrollTimeoutRef.current = setTimeout(() => {
      // placeholder for future optimizations
    }, 100);
  }, []);

  const setContainerDimensions = useCallback((height: number) => {
    setContainerHeightState(height);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    virtualizationState,
    visibleNodes,
    handleScroll,
    setContainerDimensions,
  };
}
