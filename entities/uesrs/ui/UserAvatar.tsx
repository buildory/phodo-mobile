import { Image } from "react-native";
import { User } from "../model/type";

interface UserAvatarProps {
  user: User;
}

export const UserAvatar = ({ user }: UserAvatarProps) => (
  <Image
    source={{ uri: user.avatarUrl }}
    style={{ width: 40, height: 40, borderRadius: 20 }}
  />
);
