import { useFriends } from ".";

interface ISearchResultDropdown {
  updateSearch: (search: string) => void;
}

const useSearchResultDropdown = ({ updateSearch }: ISearchResultDropdown) => {
  const { handleFriendClick } = useFriends();

  const onSearchSelection = (userId: string) => {
    handleFriendClick(userId);
    updateSearch("");
  };

  return { onSearchSelection };
};

export default useSearchResultDropdown;
