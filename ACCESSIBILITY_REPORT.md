# Accessibility Report – Hierarchical Combobox

This document describes the accessibility considerations and testing done for the Hierarchical Combobox component built as part of the assignment.

The goal was to ensure the component is fully usable with keyboard-only interaction and provides meaningful feedback to screen reader users, even with async data and virtualization.

---

## Keyboard Navigation

The component is designed to be keyboard-first.

The following interactions are supported:

- Arrow Up / Arrow Down: Move focus between visible tree items
- Arrow Right: Expand a collapsed node
- Arrow Left: Collapse an expanded node
- Space: Toggle selection of the focused item
- Enter: Confirm selection
- Escape: Close the combobox and restore focus to the trigger

Mouse interaction is optional and not required for full usage.

---

## Focus Management

A roving tabindex approach is used to manage focus within the tree.

- Only one tree item is focusable at a time
- Focus remains stable during scrolling and virtualization
- When items scroll out of view, the focused index is preserved
- On close, focus is returned to the triggering input element

Special care was taken to ensure focus does not jump unexpectedly during async loading or filtering.

---

## Screen Reader Support

The component uses appropriate ARIA roles and attributes to convey structure and state:

- `role="tree"` for the container
- `role="treeitem"` for individual nodes
- `role="group"` for nested levels
- `aria-expanded` to indicate expand/collapse state
- `aria-checked` for selection and indeterminate states

Async loading and error messages are announced using live regions so screen reader users receive feedback when data is being fetched or fails to load.

---

## Multi-Select & Indeterminate States

- Parent nodes correctly reflect indeterminate state when some (but not all) children are selected
- Screen readers announce indeterminate selection via `aria-checked="mixed"`
- Selection changes are immediately reflected in the accessibility tree

---

## Async Loading & Error Handling

- Loading indicators are focusable and keyboard reachable
- Async errors are communicated via accessible text
- Retry actions are available using keyboard interaction

This ensures async behavior does not block non-mouse users.

---

## Axe Accessibility Testing

Accessibility testing was performed using `@storybook/addon-a11y` (axe-core).

- Result: 0 accessibility violations
- 1 rule marked as "incomplete"

The incomplete rule requires manual verification related to screen reader announcement timing during async updates. This behavior was manually reviewed during development.

---

## Manual Testing

Manual accessibility testing included:

- Keyboard-only navigation across all major flows
- Verifying focus stability during virtualization and scrolling
- Logical validation of screen reader announcements based on ARIA roles and attributes
- Testing high-contrast focus visibility

---

## Summary

Accessibility was treated as a core requirement throughout development, not as an afterthought.

The component supports keyboard-first usage, provides clear screen reader feedback, and maintains usability even under large async datasets and virtualized rendering.
