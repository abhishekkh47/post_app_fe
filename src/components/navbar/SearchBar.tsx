import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearch } from "../../hooks";
import { SearchResultDropdown } from ".";

const SearchBar: React.FC = () => {
  const { search, users, updateSearch } = useSearch();

  return (
    <div className="relative right-5 border border-slate-200 bg-white rounded-md flex flex-row items-center pr-20 py-2">
      <div>
        <MagnifyingGlassIcon className="relative left-2 w-5 h-5 inset-y-0 z-10 text-slate-400" />
      </div>
      <input
        className="relative left-4 w-full bg-white placeholder:text-slate-400 text-slate-700 transition duration-300 ease focus:outline-none "
        type="text"
        placeholder="Search"
        onChange={(e) => updateSearch(e.target.value)}
      />
      {search && users.length && <SearchResultDropdown users={users} />}
    </div>
  );
};

export default SearchBar;
