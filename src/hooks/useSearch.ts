import { useEffect, useState } from "react";
import { UserService } from "../services";
import { User } from "../types";

const useSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (search) {
      const searchUser = async () => {
        const respose = await UserService.searchUserProfile(search);
        setUsers([...respose]);
      };
      searchUser();
    }
  }, [search]);

  const updateSearch = (queryString: string) => {
    setSearch(queryString);
  };

  return { users, updateSearch };
};

export default useSearch;
