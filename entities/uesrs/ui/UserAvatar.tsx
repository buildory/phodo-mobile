import { Image, Text, View } from "react-native"

export const DEFAULT_AVATARS = {
  avatar1: require('@/assets/images/avatars/avatar1.png'),
  avatar2: require('@/assets/images/avatars/avatar2.png'),
  avatar3: require('@/assets/images/avatars/avatar3.png'),
  avatar4: require('@/assets/images/avatars/avatar4.png'),
  avatar5: require('@/assets/images/avatars/avatar5.png'),
  avatar6: require('@/assets/images/avatars/avatar6.png'),
} as const;

export const DEFAULT_AVATAR_NAMES = [
  'avatar1',
  'avatar2', 
  'avatar3',
  'avatar4',
  'avatar5',
  'avatar6',
] as const;

export const getDefaultAvatarImage = (imageName: string) => {
  if (imageName in DEFAULT_AVATARS) {
    return DEFAULT_AVATARS[imageName as keyof typeof DEFAULT_AVATARS];
  }
  return null;
};


const getAvatarColor = (nickname: string): string => {
  const colors = [
    "#868B94",
    "#6941C6",
    "#D32F2F",
    "#1976D2",
    "#388E3C",
    "#F57C00",
    "#303F9F",
    "#C2185B",
    "#2A3038",
    "#B692F6",
    "#EF5350",
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
    "#5C6BC0",
    "#EC407A",
  ];

  const index = nickname.charCodeAt(0) % colors.length;
  return colors[index];
};
const getInitials = (nickname: string): string => {
  if (!nickname) return "?";

  if (/[가-힣]/.test(nickname)) {
    return nickname.charAt(0);
  }

  return nickname.charAt(0).toUpperCase();
};
interface UserAvatarProps {
  nickname?: string;
  size: number;
  imageUrl?: string;
}

export const UserAvatar = ({ nickname = "?", size, imageUrl }: UserAvatarProps) => {
  const isUrl = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));
  const isDefaultAvatar = imageUrl && DEFAULT_AVATAR_NAMES.includes(imageUrl as any);

  if (isUrl) {
    return (
      <View className="relative">
        <Image
          className="rounded-full"
          source={{ uri: imageUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      </View>
    );
  }

  if (isDefaultAvatar) {
    const defaultAvatarImage = getDefaultAvatarImage(imageUrl);
    if (defaultAvatarImage && typeof defaultAvatarImage !== 'string') {
      return (
        <Image
          source={defaultAvatarImage}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          className="rounded-full"
        />
      );
    }
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: nickname ? getAvatarColor(nickname) : "#868B94",
      }}
      className={`items-center justify-center rounded-full`}
    >
      <Text
        className="text-fg-neutral-inverted"
        style={{
          fontSize: Math.max(size * 0.4, 12),
        }}
      >
        {getInitials(nickname)}
      </Text>
    </View>
  );
};
