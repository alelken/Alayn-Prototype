import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => (
  <div className={`search-field ${className || ''}`.trim()}>
    <FaSearch className="search-icon" />
    <input ref={ref} {...props} />
  </div>
));

export default SearchInput;
