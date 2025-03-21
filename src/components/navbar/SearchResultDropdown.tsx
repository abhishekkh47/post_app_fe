import React from "react";
import { User } from "../../types";
import { useSearchResultDropdown } from "../../hooks";
import config from "../../config";

interface SearchResultDropdownProps {
  users: User[];
  updateSearch: (search: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}
const SearchResultDropdown: React.FC<SearchResultDropdownProps> = ({
  users,
  updateSearch,
  searchRef,
}) => {
  const { onSearchSelection } = useSearchResultDropdown({
    updateSearch,
    searchRef,
  });

  return (
    <ul className="absolute top-full left-0 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto shadow-lg z-10">
      {users.map((user) => (
        <li
          key={user._id}
          className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSearchSelection(user._id)}
        >
          {user?.profile_pic ? (
            <img
              src={`${config.API_URL}/uploads/${user.profile_pic}`}
              alt={user.firstName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-lg border border-black">
              {user?.firstName[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <span className="font-medium text-gray-800">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SearchResultDropdown;
