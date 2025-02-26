import { useEffect } from "react";
import { useFriends } from ".";

interface ISearchResultDropdown {
  updateSearch: (search: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

const useSearchResultDropdown = ({
  updateSearch,
  searchRef,
}: ISearchResultDropdown) => {
  const { handleFriendClick } = useFriends();

  useEffect(() => {
    document.body.addEventListener("click", (event: MouseEvent) => {
      if (
        searchRef?.current &&
        !event.composedPath().includes(searchRef.current)
      ) {
        updateSearch("");
      }
    });
  }, []);

  const onSearchSelection = (userId: string) => {
    handleFriendClick(userId);
    updateSearch("");
  };

  return { onSearchSelection };
};

export default useSearchResultDropdown;
