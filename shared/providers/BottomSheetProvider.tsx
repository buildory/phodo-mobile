import React, { createContext, useContext, useRef, ReactNode } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

type BottomSheetContextType = {
  openSheet: (sheetId: string, snapIndex?: number) => void;
  closeSheet: (sheetId: string) => void;
  closeAllSheets: () => void;
  registerSheet: (sheetId: string, ref: React.RefObject<BottomSheet>) => void;
  unregisterSheet: (sheetId: string) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

type SheetRefs = {
  [sheetId: string]: React.RefObject<BottomSheet>;
};

type BottomSheetProviderProps = {
  children: ReactNode;
};

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
  const sheetRefs = useRef<SheetRefs>({});

  const registerSheet = (sheetId: string, ref: React.RefObject<BottomSheet>) => {
    sheetRefs.current[sheetId] = ref;
  };

  const unregisterSheet = (sheetId: string) => {
    delete sheetRefs.current[sheetId];
  };

  const openSheet = (sheetId: string, snapIndex: number = 0) => {
    Object.keys(sheetRefs.current).forEach(id => {
      if (id !== sheetId && sheetRefs.current[id]?.current) {
        sheetRefs.current[id].current?.close();
      }
    });

    if (sheetRefs.current[sheetId]?.current) {
      sheetRefs.current[sheetId].current?.snapToIndex(snapIndex);
    }
  };

  const closeSheet = (sheetId: string) => {
    if (sheetRefs.current[sheetId]?.current) {
      sheetRefs.current[sheetId].current?.close();
    }
  };

  const closeAllSheets = () => {
    Object.values(sheetRefs.current).forEach(ref => {
      ref?.current?.close();
    });
  };

  const value: BottomSheetContextType = {
    openSheet,
    closeSheet,
    closeAllSheets,
    registerSheet,
    unregisterSheet,
  };

  return (
    <BottomSheetContext.Provider value={value}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider');
  }
  return context;
};
