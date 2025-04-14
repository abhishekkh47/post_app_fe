import React from "react";
import { User } from "../../types";
import { useSearchResultDropdown } from "../../hooks";
import { ProfilePicture } from "../profile";

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
    <ul className="absolute top-full left-0 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto shadow-lg z-10 sm:max-h-80">
      {users.map((user) => (
        <li
          key={user._id}
          className="flex items-center space-x-4 p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSearchSelection(user._id)}
        >
          <ProfilePicture
            profile_pic={user?.profile_pic}
            firstName={user.firstName}
            size={8}
            text={`lg`}
          />
          <div className="flex-1">
            <span className="font-medium text-gray-800 text-sm sm:text-base">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SearchResultDropdown;
