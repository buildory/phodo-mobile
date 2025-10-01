import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect, useMemo, useCallback } from "react";
import { View, Text, Pressable, TextInput, Keyboard, Platform } from "react-native";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useBottomSheet } from "@/shared/providers/BottomSheetProvider";
import { BOTTOM_SHEET_IDS } from "@/shared/hooks/useBottomSheetManager";
import ActionButton from "@/shared/ui/ActionButton";

export type CancelReasonSheetRef = {
  open: () => void;
  close: () => void;
};

interface CancelReasonSheetProps {
  onConfirm: (reason: string) => void;
}

const CANCEL_REASONS = [
  "상대방과 시간이 맞지 않아요",
  "촬영 장소가 멀거나 변경되었어요",
  "컨디션이 좋지 않아요",
  "다른 급한 일정이 생겼어요",
  "응답이 늦거나 연락이 어려웠어요",
  "기타"
];

const CancelReasonSheet = forwardRef<CancelReasonSheetRef, CancelReasonSheetProps>(
  ({ onConfirm }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { registerSheet, unregisterSheet, openSheet, closeSheet } = useBottomSheet();
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const snapPoints = useMemo(() => {
      return keyboardHeight > 0 ? ["80%"] : ["60%"];
    }, [keyboardHeight]);

    useImperativeHandle(ref, () => ({
      open: () => openSheet(BOTTOM_SHEET_IDS.CANCEL_REASON, 0),
      close: () => closeSheet(BOTTOM_SHEET_IDS.CANCEL_REASON),
    }));

    useEffect(() => {
      registerSheet(BOTTOM_SHEET_IDS.CANCEL_REASON, bottomSheetRef);
      return () => unregisterSheet(BOTTOM_SHEET_IDS.CANCEL_REASON);
    }, [registerSheet, unregisterSheet]);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e) => {
          setKeyboardHeight(e.endCoordinates.height);
          setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(0);
          }, 100);
        }
      );
      
      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardHeight(0);
          setTimeout(() => {
            bottomSheetRef.current?.snapToIndex(0);
          }, 100);
        }
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);


    const toggleReason = (reason: string) => {
      setSelectedReasons(prev => {
        if (prev.includes(reason)) {
          return [];
        } else {
          return [reason];
        }
      });
    };

    const handleConfirm = () => {
      if (selectedReasons.length === 0) {
        return;
      }

      const hasCustom = selectedReasons.includes("기타");
      const reason = hasCustom ? customReason : selectedReasons.join(", ");
      onConfirm(reason);
      
      setSelectedReasons([]);
      setCustomReason("");
      closeSheet(BOTTOM_SHEET_IDS.CANCEL_REASON);
    };

    const isConfirmEnabled = selectedReasons.length > 0 && 
      (!selectedReasons.includes("기타") || customReason.trim().length > 0);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableOverDrag={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        backgroundStyle={{
          backgroundColor: 'transparent',
        }}
        handleIndicatorStyle={{
          backgroundColor: '#E5E7EB',
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 bg-bg-layer-default">
          <View className="flex-1 p-16">
            <Text className="heading2-semiBold text-fg-neutral-solid py-16">
              촬영 취소 사유를 선택해주세요
            </Text>
            
            <View className="flex-1">
              {CANCEL_REASONS.map((reason, index) => (
                <Pressable
                  key={index}
                  onPress={() => toggleReason(reason)}
                  className="flex-row items-center p-4"
                >
                  <View className={`w-20 h-20 mr-12 rounded-4 items-center justify-center ${
                    selectedReasons.includes(reason) 
                      ? 'bg-fg-info-solid' 
                      : ' border border-stroke-divider-subtle'
                  }`}>
                    {selectedReasons.includes(reason) && (
                      <Text className="text-xs font-bold text-fg-neutral-inverted">✓</Text>
                    )}
                  </View>
                  <Text className="body2-medium text-fg-neutral-solid flex-1">
                    {reason}
                  </Text>
                </Pressable>
              ))}
              
              {selectedReasons.includes("기타") && (
                <View>
                  <TextInput
                    value={customReason}
                    onChangeText={setCustomReason}
                    placeholder="내용을 입력하세요"
                    className="border border-stroke-field rounded-8 p-12 body1-regular text-fg-neutral-solid"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </View>
            
            <ActionButton
              disabled={!isConfirmEnabled}
              onPress={handleConfirm}
              className="w-full mt-16"
              size="lg"
              variant="primary"
              title="촬영 취소하기"
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default CancelReasonSheet;
