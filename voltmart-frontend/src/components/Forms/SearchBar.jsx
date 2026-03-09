import Button from "../UI/Button";

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder,
  showButton = true,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="vm-toolbar__group">
      <input
        className="vm-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      {showButton && (
        <Button variant="secondary" onClick={onSearch}>
          Search
        </Button>
      )}
    </div>
  );
}

export default SearchBar;
