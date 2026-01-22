/**
 * Accessibility utilities and ARIA helpers
 */

export class A11y {
  /**
   * Get ARIA label for tree node with hierarchy context
   */
  static getNodeLabel(
    label: string,
    _level: number,
    isExpanded?: boolean,
    hasChildren?: boolean
  ): string {
    let ariaLabel = label;

    if (hasChildren) {
      ariaLabel += isExpanded ? ', expanded' : ', collapsed';
    }

    return ariaLabel;
  }

  /**
   * Get ARIA description for search context
   */
  static getSearchContextDescription(ancestors: string[]): string {
    if (ancestors.length === 0) {
      return 'Root level item';
    }

    return `In: ${ancestors.join(' > ')}`;
  }

  /**
   * Announce to screen reader
   */
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Clean up after announcement is read
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  /**
   * Get selection announcement
   */
  static getSelectionAnnouncement(selectedCount: number, total: number): string {
    if (selectedCount === 0) {
      return 'No items selected';
    }
    if (selectedCount === total) {
      return `All ${total} items selected`;
    }
    return `${selectedCount} of ${total} items selected`;
  }

  /**
   * Get keyboard shortcut hint
   */
  static getKeyboardHint(action: string): string {
    const hints: Record<string, string> = {
      navigate: 'Use arrow keys to navigate',
      select: 'Press Space or Enter to select',
      expand: 'Press Right arrow to expand, Left to collapse',
      close: 'Press Escape to close',
      search: 'Type to search',
    };

    return hints[action] || '';
  }

  /**
   * Validate color contrast (simplified check)
   */
  static hasGoodContrast(foreground: string, background: string): boolean {
    // This is a simplified check - in production, use a proper contrast checker
    // For now, we assume our predefined color pairs are WCAG AA compliant
    const validPairs = [
      ['text-gray-600', 'bg-white'],
      ['text-gray-700', 'bg-gray-100'],
      ['text-gray-800', 'bg-blue-50'],
      ['text-gray-900', 'bg-blue-100'],
    ];

    return validPairs.some(
      ([fg, bg]) =>
        (fg && bg && foreground.includes(fg) && background.includes(bg)) ||
        (fg && bg && foreground.includes(bg) && background.includes(fg))
    );
  }
}
