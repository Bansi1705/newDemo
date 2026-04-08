import type { searchBarProps } from "../../types";

export const SearchBar: React.FC<searchBarProps> = ({
  searchTerm,
  searchPlaceholder,
  searchOnChange,
  searchClssName,
  searchDisable
}) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={searchOnChange}
        className={searchClssName}
        disabled={searchDisable}
      />
    </div>
  );
};
