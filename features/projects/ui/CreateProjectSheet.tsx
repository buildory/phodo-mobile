import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { Text, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ValidatedInput from "@/shared/ui/ValidatedInput";
import LongButton from "@/shared/ui/Button";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import { useProjectFormStore } from "@/features/projects/model/useProjectFormStore";
import { useBottomSheet } from "@/shared/providers/BottomSheetProvider";
import { BOTTOM_SHEET_IDS } from "@/shared/hooks/useBottomSheetManager";

export type CreateProjectSheetRef = {
  open: (index: number) => void;
  close: () => void;
};

const validateTitle = (value: { inputLocation: string }) => {
  const errors: Partial<Record<keyof typeof value, string>> = {};
  if (!value.inputLocation.trim()) {
    errors.inputLocation = "주소를 입력해주세요.";
  }
  return errors;
};

const CreateProjectSheet = forwardRef<CreateProjectSheetRef>(({location}, ref) => {
  const { setField } = useProjectFormStore();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { registerSheet, unregisterSheet, openSheet, closeSheet } = useBottomSheet();
  const snapPoints = useMemo(() => {
  return isKeyboardVisible ? ["40%", "55%"] : ["40%"];
}, [isKeyboardVisible]);
  const router = useRouter();

  const { values, setValue, errors, validate } = useFormValidator(
    { inputLocation: "" },
    validateTitle
  );

  useImperativeHandle(ref, () => ({
    open: (index = 0) => openSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT, index),
    close: () => closeSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT),
  }));

  // Sheet 등록/해제
  useEffect(() => {
    registerSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT, bottomSheetRef);
    return () => unregisterSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT);
  }, [registerSheet, unregisterSheet]);

useEffect(() => {
  const showSub = Keyboard.addListener("keyboardDidShow", () => {
    setIsKeyboardVisible(true);
    bottomSheetRef.current?.snapToIndex(1);
  });
  const hideSub = Keyboard.addListener("keyboardDidHide", () => {
    bottomSheetRef.current?.snapToIndex(0);
    setIsKeyboardVisible(false);
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);

  return (
    <BottomSheet
      index={-1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableContentPanningGesture={false}
      enablePanDownToClose={true}
    >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
      <BottomSheetView className="flex-1 p-16">
          <Text className="heading2-semiBold text-fg-neutral-solid">촬영 장소 이름을 입력해주세요</Text>
          <Text className="label1-semiBold text-fg-neutral-muted mt-8 mb-20">다른 사용자도 알아볼 수 있도록 간단히 입력해주세요</Text>
          <ValidatedInput
            placeholder="예)강남역 1번 출구, 교보타워 앞"
            value={values.inputLocation}
            onChangeText={(text) => setValue("inputLocation", text)}
            autoCapitalize="none"
            error={errors.inputLocation}
          />
          <LongButton
            disabled={!values.inputLocation}
            onPress={() => {
              setField('latitude', location.latitude);
              setField('longitude', location.longitude);
              setField('locationAddress', location.address);
              setField('inputLocation', values.inputLocation);
              setValue('inputLocation', "");
              closeSheet(BOTTOM_SHEET_IDS.CREATE_PROJECT);
              router.push("/project/new")
            }}
            title="이 위치에서 촬영하기"
          />
      </BottomSheetView>
        </KeyboardAvoidingView>
    </BottomSheet>
  );
});

export default CreateProjectSheet;
