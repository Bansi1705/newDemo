import type { searchBarProps } from "../../Interface/types";

export const SearchBar: React.FC<searchBarProps> = ({
  searchTerm,
  searchPlaceholder,
  searchOnChange,
  searchClssName,
}) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={searchOnChange}
        className={searchClssName}
        name="searchInput"
        id="searchInput"
      />
    </div>
  );
};
