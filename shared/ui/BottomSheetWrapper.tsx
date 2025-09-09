import React, { useEffect, useRef } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/shared/providers/BottomSheetProvider';

type BottomSheetWrapperProps = {
  sheetId: string;
  children: React.ReactNode;
  snapPoints: string[];
  index?: number;
  enableContentPanningGesture?: boolean;
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  onChange?: (index: number) => void;
};

export const BottomSheetWrapper: React.FC<BottomSheetWrapperProps> = ({
  sheetId,
  children,
  snapPoints,
  index = -1,
  enableContentPanningGesture = false,
  enablePanDownToClose = true,
  onClose,
  onChange,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { registerSheet, unregisterSheet } = useBottomSheet();

  useEffect(() => {
    registerSheet(sheetId, bottomSheetRef);
    return () => unregisterSheet(sheetId);
  }, [sheetId, registerSheet, unregisterSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={index}
      snapPoints={snapPoints}
      enableContentPanningGesture={enableContentPanningGesture}
      enablePanDownToClose={enablePanDownToClose}
      onClose={onClose}
      onChange={onChange}
    >
      {children}
    </BottomSheet>
  );
};
