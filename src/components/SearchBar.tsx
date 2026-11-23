import { Search, X } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  margin_right?: number;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search epics...",
  margin_right,
  className = "",
}: SearchBarProps) => {
  return (
    <div
      className={`w-full md:w-50 lg:w-75 flex items-center rounded-md md:rounded-none surface-highest ${
        margin_right ? (margin_right > 0 ? "lg:mr-52" : "md:mr-4") : ""
      } p-3 ${className}`}
    >
      <Search size={14} color="#737685" strokeWidth={1.25} />
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
        className="body-md ml-3 w-full bg-transparent focus:outline-none"
      />
      {value && onChange && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;