import React, { ReactElement, useState, ReactNode  } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib";

const tabVariants = cva(
  "flex-1 items-center",
  {
    variants: {
      variant: {
        default: "border-b-2 border-transparent",
        underline: "border-b-2",
        outline: "border-b-2 border-transparent",
      },
      active: {
        true: "border-fg-brand",
        false: "border-stroke-divider-subtle",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        active: true,
        className: "border-fg-brand",
      },
      {
        variant: "underline",
        active: true,
        className: "border-fg-brand",
      },
      {
        variant: "outline",
        active: true,
        className: "border-fg-brand",
      },
    ],
    defaultVariants: {
      variant: "default",
    },
  }
);

const tabTextVariants = cva(
  "body2-medium p-8",
  {
    variants: {
      variant: {
        default: "",
        underline: "",
        outline: "",
      },
      active: {
        true: "font-bold text-fg-brand",
        false: "text-fg-neutral-solid",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
);

type TabLayoutProps = {
  children: ReactElement<TabItemProps>[];
  initialTab?: string;
  variant?: VariantProps<typeof tabVariants>["variant"];
  contentClassName?: string;
};

export type TabItemProps = {
  name: string;
  title: string;
  children: ReactNode;
};

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}

export function Tabs({
  children,
  initialTab,
  variant = "default",
  contentClassName,
}: TabLayoutProps) {
  const tabList = React.Children.toArray(children) as ReactElement<TabItemProps>[];
  const [activeTab, setActiveTab] = useState(initialTab || tabList[0].props.name);

  const activeTabContent = tabList.find(tab => tab.props.name === activeTab)?.props.children;

  return (
    <View className="flex-1">
      <View className="flex-row">
        {tabList.map(tab => {
          const isActive = activeTab === tab.props.name;
          return (
            <TouchableOpacity
              key={tab.props.name}
              className={tabVariants({ variant, active: isActive })}
              onPress={() => setActiveTab(tab.props.name)}
            >
              <Text className={tabTextVariants({ variant, active: isActive })}>
                {tab.props.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className={cn("flex-1 justify-center items-center p-4", contentClassName)}>
        {activeTabContent}
      </View>
    </View>
  );
}

