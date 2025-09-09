import { useBottomSheet } from '@/shared/providers/BottomSheetProvider';

export const BOTTOM_SHEET_IDS = {
  CREATE_PROJECT: 'create-project-sheet',
  PROJECT_LIST: 'project-list-sheet',
  PROJECT_DETAIL: 'project-detail-sheet',
  USER_PROFILE: 'user-profile-sheet',
  CHAT_ROOM: 'chat-room-sheet',
  NOTIFICATION: 'notification-sheet',
} as const;

export type BottomSheetId = typeof BOTTOM_SHEET_IDS[keyof typeof BOTTOM_SHEET_IDS];

export const useBottomSheetManager = () => {
  const { openSheet, closeSheet, closeAllSheets } = useBottomSheet();

  const openCreateProjectSheet = (snapIndex?: number) => {
    openSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT, snapIndex);
  };

  const closeCreateProjectSheet = () => {
    closeSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT);
  };

  const openProjectListSheet = (snapIndex?: number) => {
    openSheet(BOTTOM_SHEET_IDS.PROJECT_LIST, snapIndex);
  };

  const closeProjectListSheet = () => {
    closeSheet(BOTTOM_SHEET_IDS.PROJECT_LIST);
  };

  const openProjectDetailSheet = (snapIndex?: number) => {
    openSheet(BOTTOM_SHEET_IDS.PROJECT_DETAIL, snapIndex);
  };

  const closeProjectDetailSheet = () => {
    closeSheet(BOTTOM_SHEET_IDS.PROJECT_DETAIL);
  };

  const openUserProfileSheet = (snapIndex?: number) => {
    openSheet(BOTTOM_SHEET_IDS.USER_PROFILE, snapIndex);
  };

  const closeUserProfileSheet = () => {
    closeSheet(BOTTOM_SHEET_IDS.USER_PROFILE);
  };

  const openChatRoomSheet = (snapIndex?: number) => {
    openSheet(BOTTOM_SHEET_IDS.CHAT_ROOM, snapIndex);
  };

  const closeChatRoomSheet = () => {
    closeSheet(BOTTOM_SHEET_IDS.CHAT_ROOM);
  };

  const openNotificationSheet = (snapIndex?: number) => {
    openSheet(BOTTOM_SHEET_IDS.NOTIFICATION, snapIndex);
  };

  const closeNotificationSheet = () => {
    closeSheet(BOTTOM_SHEET_IDS.NOTIFICATION);
  };

  return {
    openSheet,
    closeSheet,
    closeAllSheets,
    
    openCreateProjectSheet,
    closeCreateProjectSheet,
    openProjectListSheet,
    closeProjectListSheet,
    openProjectDetailSheet,
    closeProjectDetailSheet,
    openUserProfileSheet,
    closeUserProfileSheet,
    openChatRoomSheet,
    closeChatRoomSheet,
    openNotificationSheet,
    closeNotificationSheet,
  };
};
