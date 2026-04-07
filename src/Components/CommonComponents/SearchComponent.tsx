import type { searchBarProps } from "../../types";

export const SearchBar: React.FC<searchBarProps> = ({ searchTerm,  searchPlaceholder, searchOnChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={searchOnChange}
      />
    </div>
  );
};