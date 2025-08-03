import { Pressable, Text, View, PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib";

type BadgeProps = {
  label: string | number;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  textClassName?: string;
} & VariantProps<typeof badgeVariants> &
  PressableProps;

const badgeVariants = cva(
  "self-start w-fit flex-row items-center border rounded-full",
  {
    variants: {
      size: {
        sm: "px-6 py-3 caption2-medium",
        md: "px-8 py-4 label2-medium",
        lg: "px-10 py-5 body2-medium",
      },
      variant: {
        default:
          "bg-bg-layer-default text-bg-neutral-inverted border-stroke-divider-subtle",
        outline:
          "bg-transparent border-stroke-divider-subtle text-fg-neutral-solid",
        subtle:
          "bg-bg-layer-subtle text-fg-neutral-muted border-stroke-divider-subtle",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const badgeTextVariants = cva("", {
  variants: {
    size: {
      sm: "caption2-medium",
      md: "label2-medium",
      lg: "body2-medium",
    },
    variant: {
      default: "text-bg-neutral-inverted",
      outline: "text-fg-neutral-solid",
      subtle: "text-fg-neutral-muted",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export default function Badge({
  label,
  icon,
  iconPosition = "left",
  size,
  variant,
  className,
  textClassName,
  onPress,
  ...props
}: BadgeProps) {
  const container = badgeVariants({ size, variant });
  const text = badgeTextVariants({ size, variant });

  return (
    <Pressable
      onPress={onPress}
      className={cn(badgeVariants({ size, variant }), className)}
      {...props}
    >
      {icon && iconPosition === "left" && <View className="mr-2">{icon}</View>}
      <Text className={cn(badgeTextVariants({ size, variant }), textClassName)}>
        {label}
      </Text>
      {icon && iconPosition === "right" && <View className="ml-2">{icon}</View>}
    </Pressable>
  );
}
