import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { StyleSheet, Text, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ValidatedInput from "@/shared/ui/ValidatedInput";
import LongButton from "@/shared/ui/Button";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import { useProjectFormStore } from "@/features/projects/model/useProjectFormStore";

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
  const snapPoints = useMemo(() => {
  return isKeyboardVisible ? ["35%", "55%"] : ["35%"];
}, [isKeyboardVisible]);
  const router = useRouter();

  const { values, setValue, errors, validate } = useFormValidator(
    { inputLocation: "" },
    validateTitle
  );

  useImperativeHandle(ref, () => ({
    open: (index = 0) => bottomSheetRef.current?.snapToIndex(index),
    close: () => bottomSheetRef.current?.close(),
  }));

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
      <BottomSheetView style={styles.contentContainer}>
          <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 4}}>촬영 장소 이름을 입력해주세요</Text>
          <Text style={{fontSize: 14, color: '#535862',marginBottom: 20}}>다른 사용자도 알아볼 수 있도록 간단히 입력해주세요</Text>
          <ValidatedInput
            placeholder="예)강남역 1번 출구, 교보타워 앞"
            value={values.inputLocation}
            onChangeText={(text) => setValue("inputLocation", text)}
            autoCapitalize="none"
            error={errors.inputLocation}
          />
          <LongButton
            onPress={() => {
              setField('latitude', location.latitude);
              setField('longitude', location.longitude);
              setField('locationAddress', location.address);
              setField('inputLocation', values.inputLocation);
              router.push("/project/new")
            }}
            title="이 위치에 촬영 맵핀 등록하기"
          />
      </BottomSheetView>
        </KeyboardAvoidingView>
    </BottomSheet>
  );
});

export default CreateProjectSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flatListContent: {
    gap: 20,
    paddingBottom: 20,
  },
});
