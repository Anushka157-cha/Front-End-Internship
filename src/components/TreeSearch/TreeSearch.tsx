/**
 * Tree search component
 */

import React from 'react';

interface TreeSearchProps {
  value: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSearching?: boolean;
  resultCount?: number;
}

export const TreeSearch = React.forwardRef<HTMLInputElement, TreeSearchProps>(
  (
    {
      value,
      onSearchChange,
      placeholder = 'Search items...',
      disabled = false,
      isSearching = false,
      resultCount,
    }: TreeSearchProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    };

    const handleClear = () => {
      onSearchChange('');
    };

    return (
      <div className="tree-search">
        <div className="tree-search__input-wrapper">
          <input
            ref={ref}
            type="text"
            className={`tree-search__input ${isSearching ? 'tree-search__input--searching' : ''}`}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-label="Search tree items"
            aria-describedby={resultCount !== undefined ? 'search-result-count' : undefined}
            aria-busy={isSearching}
          />

          {value && (
            <button
              className="tree-search__clear"
              onClick={handleClear}
              aria-label="Clear search"
              tabIndex={-1}
            >
              ✕
            </button>
          )}

          {isSearching && <span className="tree-search__spinner" aria-hidden="true" />}
        </div>

        {resultCount !== undefined && (
          <div id="search-result-count" className="tree-search__result-count">
            {resultCount} result{resultCount !== 1 ? 's' : ''} found
          </div>
        )}
      </div>
    );
  }
);

TreeSearch.displayName = 'TreeSearch';
