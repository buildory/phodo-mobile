import React from "react";
import Badge from "@/shared/ui/Badge";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import Octicons from "@expo/vector-icons/Octicons";
import { cn } from "@/shared/lib";

const SHOOTING_STATUS = {
  PENDING: "pending",
  READY: "ready",
  SHOOTING: "shooting",
  REVIEW: "review",
  DONE: "done",
  CANCEL: "cancel",
} as const;

type ShootingStatus =
  (typeof SHOOTING_STATUS)[keyof typeof SHOOTING_STATUS];

const SHOOTING_STATUS_LABELS: Record<ShootingStatus, string> = {
  [SHOOTING_STATUS.PENDING]: "매칭대기",
  [SHOOTING_STATUS.READY]: "촬영대기",
  [SHOOTING_STATUS.SHOOTING]: "촬영중",
  [SHOOTING_STATUS.REVIEW]: "공유대기",
  [SHOOTING_STATUS.DONE]: "촬영완료",
  [SHOOTING_STATUS.CANCEL]: "촬영취소",
};

const SHOOTING_STATUS_CLASSES: Record<
  ShootingStatus,
  {
    className: string; // Badge 전체에 적용
    textClassName: string;
    iconColorClass?: string; // 아이콘 색상에 적용
  }
> = {
  [SHOOTING_STATUS.PENDING]: {
    className: "bg-bg-overlay-weak border-none",
    textClassName : "text-fg-neutral-solid",
    iconColorClass: "#1A1C20",
  },
  [SHOOTING_STATUS.READY]: {
    className: "bg-bg-info-opacity border-none",
    textClassName : "text-fg-info-solid",
    iconColorClass: "#1976D2",
  },
  [SHOOTING_STATUS.SHOOTING]: {
    className: "bg-bg-info-opacity border-none",
    textClassName : "text-fg-info-solid",
    iconColorClass: "#1976D2",
  },
  [SHOOTING_STATUS.REVIEW]: {
    className: "bg-bg-curious-opacity border-none",
    textClassName : "text-fg-curious-solid",
    iconColorClass: "#F57C00",
  },
  [SHOOTING_STATUS.DONE]: {
    className: "bg-bg-positive-opacity border-none",
    textClassName : "text-fg-positive-solid",
    iconColorClass: "#388E3C",
  },
  [SHOOTING_STATUS.CANCEL]: {
    className: "bg-bg-critical-opacity border-none",
    textClassName : "text-fg-critical-solid label2-semiBold",
    iconColorClass: "#D32F2F",
  },
};

interface ShootingStatusBadgeProps {
  status: ShootingStatus;
}

export function ShootingStatusBadge({
  status,
}: ShootingStatusBadgeProps) {
  const { className, textClassName, iconColorClass } = SHOOTING_STATUS_CLASSES[status];

  return (
    <Badge
      className={cn(className, "rounded-full")}
      textClassName={textClassName}
      label={SHOOTING_STATUS_LABELS[status]}
      icon={<Octicons className="mr-2" name="dot-fill" size={14} color={iconColorClass} />}
      iconPosition="left"
    />
  );
}
