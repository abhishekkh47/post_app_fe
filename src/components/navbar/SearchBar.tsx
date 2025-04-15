import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearch } from "../../hooks";
import { SearchResultDropdown } from ".";

const SearchBar: React.FC = () => {
  const { search, users, searchRef, updateSearch } = useSearch();

  return (
    <div className="relative mx-auto w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-4">
      <div className="relative border border-slate-200 bg-white rounded-md flex items-center pr-4 py-2 sm:pr-6 md:pr-8">
        <div className="pl-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400" />
        </div>
        <input
          ref={searchRef}
          className="ml-3 w-full bg-white placeholder:text-slate-400 text-slate-700 transition duration-300 ease-in-out focus:outline-none text-sm sm:text-base"
          type="text"
          value={search}
          placeholder="Search"
          onChange={(e) => updateSearch(e.target.value)}
        />
        {search && users.length > 0 && (
          <SearchResultDropdown
            users={users}
            updateSearch={updateSearch}
            searchRef={searchRef}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
