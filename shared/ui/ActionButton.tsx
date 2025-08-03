import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib";

type ActionButtonProps = {
  title: string;
  loading?: boolean;
  disabled?: boolean;
} & VariantProps<typeof actionButtonVariants> &
  TouchableOpacityProps;

const actionButtonVariants = cva("", {
  variants: {
    size: {
      sm: "px-12 py-7 rounded-8",
      md: "px-14 py-9 rounded-10",
      lg: "px-16 py-12 rounded-12",
    },
    variant: {
      primary: "bg-fg-brand",
      assistive: "bg-bg-neutral-weak",
      disabled: "bg-bg-disabled",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

const actionButtonTextVariants = cva("text-center", {
  variants: {
    size: {
      sm: "label2-semiBold",
      md: "body2-semiBold",
      lg: "body1-semiBold",
    },
    variant: {
      primary: "text-fg-neutral-inverted",
      assistive: "text-fg-neutral-muted",
      disabled: "text-fg-disabled",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export default function ActionButton({
  title,
  loading,
  disabled = false,
  className,
  size,
  variant,
  onPress,
  ...props
}: ActionButtonProps) {
  const appliedVariant = disabled ? "disabled" : variant;
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className={cn(actionButtonVariants({ size, variant: appliedVariant }), className)}
      {...props}
      onPress={onPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={cn(actionButtonTextVariants({ size, variant: appliedVariant }))}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
