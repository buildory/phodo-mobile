import {
  SafeAreaView,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useApplicants } from "@/entities/projects/model/useApplicants";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ApplicantCard from "@/features/projects/ui/ApplicantCard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { useProject } from "@/entities/projects/model";
import { useLocationTracking } from "@/shared/hooks/useLocationTracking";
import CancelReasonSheet, { CancelReasonSheetRef } from "@/features/projects/ui/CancelReasonSheet";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateApplicant } from "@/entities/projects/model";
import { useToast } from "@/shared/hooks/useToast";
import { useCreateNotification } from "@/entities/notification/model";

export default function ApplicantScreen() {
  const { id } = useLocalSearchParams();
  const { data: applicants } = useApplicants(Number(id));
  const { data: project } = useProject(String(id));
  const queryClient = useQueryClient();
  const { mutate: updateApplicant } = useUpdateApplicant();
  const { mutate: createNotification } = useCreateNotification();
  const toast = useToast();
  const cancelReasonSheetRef = useRef<CancelReasonSheetRef>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 위치 추적 훅 사용
  const { location: myLocation } = useLocationTracking({
    accuracy: 1, // Highest accuracy
    timeInterval: 10000, // 10초마다
    distanceInterval: 10, // 10m 이동 시에만
    enabled: true
  });

  // myLocation을 ApplicantCard에 맞는 형태로 변환
  const myLocationForCard = myLocation ? {
    latitude: myLocation.coords.latitude,
    longitude: myLocation.coords.longitude
  } : null;

  const pendingApplicants = applicants?.filter(
    (p) =>
      p.status === "pending" || p.status === "ready" || p.status === "review"
  );

  const inProgressApplicants = applicants?.filter(
    (p) => p.status === "shooting"
  );

  const doneApplicants = applicants?.filter((p) => p.status === "done");

  const canceledApplicants = applicants?.filter((p) => p.status === "cancel");

  const handleCancelPress = (item: any) => {
    setSelectedItem(item);
    cancelReasonSheetRef.current?.open();
  };

  const handleShootingCancel = (reason: string) => {
    if (!selectedItem) return;

    updateApplicant(
      {
        id: selectedItem?.id,
        values: {
          status: "cancel",
          reason: reason,
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          createNotification({
            title: "촬영 취소",
            body: `아쉽지만 이번 촬영은 취소되었어요. 곧 더 멋진 촬영이 기다리고 있을 거예요!`,
            userId: selectedItem.applicant.id,
            data: { type: "shooting", userId: selectedItem.applicant.id },
          });
          queryClient.invalidateQueries({ queryKey: ["applicants", Number(id)]});
          setSelectedItem(null);
        },
        onError: (error: any) => {
          console.error("촬영 취소 중 오류:", error);
          toast.showError("촬영 취소 실패", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <Pressable
          onPress={() => router.back()}
          className="flex flex-row gap-12 p-16"
        >
          <View className="mt-4">
            <IconSymbol size={24} name="chevron.left" color={"#181D27"} />
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="heading2-semiBold flex-1"
          >
            {project?.title}
          </Text>
        </Pressable>
        <View className="bg-bg-layer-baasement flex-1">
        <Tabs variant="underline">
          <TabItem name="my" title="대기">
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {pendingApplicants && pendingApplicants.length > 0 ? (
                <FlatList
                  data={pendingApplicants}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ApplicantCard item={item} project={project} myLocation={myLocationForCard} onCancelPress={handleCancelPress} />
                  )}
                  contentContainerStyle={{
                    gap: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 20,
                  }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="heading1-semiBold text-fg-neutral-solid">
                    촬영 내역이 없어요
                  </Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </TabItem>
          <TabItem name="apply" title="진행중">
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {inProgressApplicants && inProgressApplicants.length > 0 ? (
                <FlatList
                  data={inProgressApplicants}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ApplicantCard item={item} project={project} myLocation={myLocationForCard} onCancelPress={handleCancelPress} />
                  )}
                  contentContainerStyle={{
                    gap: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 20,
                  }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="heading1-semiBold text-fg-neutral-solid">
                    촬영 내역이 없어요
                  </Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </TabItem>
          <TabItem name="complete" title="완료">
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {doneApplicants && doneApplicants.length > 0 ? (
                <FlatList
                  data={doneApplicants}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ApplicantCard item={item} project={project} myLocation={myLocationForCard} onCancelPress={handleCancelPress} />
                  )}
                  contentContainerStyle={{
                    gap: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 20,
                  }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="heading1-semiBold text-fg-neutral-solid">
                    촬영 내역이 없어요
                  </Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </TabItem>
          <TabItem name="cancel" title="취소">
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {canceledApplicants && canceledApplicants.length > 0 ? (
                <FlatList
                  data={canceledApplicants}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <ApplicantCard item={item} project={project} myLocation={myLocationForCard}/>
                  )}
                  contentContainerStyle={{
                    gap: 20,
                    paddingHorizontal: 8,
                    paddingVertical: 20,
                  }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="heading1-semiBold text-fg-neutral-solid">
                    촬영 내역이 없어요
                  </Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </TabItem>
        </Tabs>
        </View>
      </SafeAreaView>
      
      <CancelReasonSheet
        ref={cancelReasonSheetRef}
        onConfirm={handleShootingCancel}
      />
    </GestureHandlerRootView>
  );
}
