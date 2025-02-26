import { useEffect, useState, useRef } from "react";
import { UserService } from "../services";
import { User } from "../types";

const useSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.value = search;
    }
  }, [search]);

  useEffect(() => {
    if (search) {
      const searchUser = async () => {
        const response = await UserService.searchUserProfile(search);
        setUsers([...response.users]);
      };
      searchUser();
    }
  }, [search]);

  const updateSearch = (queryString: string) => {
    setSearch(queryString);
  };

  return { search, users, searchRef, updateSearch };
};

export default useSearch;
