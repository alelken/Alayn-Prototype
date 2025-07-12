import React from 'react';
import { IoSearch } from 'react-icons/io5';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => (
  <div className={`search-field ${className || ''}`.trim()}>
    <IoSearch className="search-icon" />
    <input ref={ref} {...props} />
  </div>
));

export default SearchInput;
