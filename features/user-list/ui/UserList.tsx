import { FlatList } from "react-native";
import { useUserListQuery } from "../lib/useUserListQuery";
import { UserAvatar } from "@/entities/uesrs/ui/UserAvatar";
import { UserName } from "@/entities/uesrs/ui/UserName";

export const UserList = () => {
  const { data: users, isLoading } = useUserListQuery();

  if (isLoading) return null;

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <>
          <UserAvatar user={item} />
          <UserName user={item} />
        </>
      )}
    />
  );
};
