import { Text } from "react-native";
import { User } from "../model/type";

interface UserNameProps {
  user: User;
}

export const UserName = ({ user }: UserNameProps) => (
  <Text style={{ fontWeight: "bold" }}>{user.name}</Text>
);
