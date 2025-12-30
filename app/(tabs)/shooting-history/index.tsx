import {
  SafeAreaView,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useMyProjects,
  useAppliedProjects,
} from "@/entities/projects/model";
import { useUpdateApplicant } from "@/entities/projects/model";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/useToast";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { View, Text } from "react-native";
import MyProjectCard from "@/features/projects/ui/MyProjectCard";
import AppliedProjectCard from "@/features/projects/ui/AppliedProjectCard";
import CancelReasonSheet from "@/features/projects/ui/CancelReasonSheet";
import { useRef } from "react";
import { CancelReasonSheetRef } from "@/features/projects/ui/CancelReasonSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNotification } from "@/entities/notification/api/createNotification";

export default function ShootingHistoryScreen() {
  const { profile } = useCurrentUserStore();
  const { data: myProjects } = useMyProjects(profile?.id ?? "");
  const { data: appliedProjects } = useAppliedProjects(profile?.id ?? "");
  const cancelReasonSheetRef = useRef<CancelReasonSheetRef>(null);
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutate: updateApplicant } = useUpdateApplicant();
  let selectedItemRef: any = undefined;
  const pendingProjects = appliedProjects?.filter(
    (p) =>
      p.status === "pending" || p.status === "ready" || p.status === "review"
  );

const inProgressProjects = appliedProjects?.filter(
    (p) => p.status === "shooting"
  );

  const doneProjects = appliedProjects?.filter((p) => p.status === "done");

  const canceledProjects = appliedProjects?.filter(
    (p) => p.status === "cancel"
  );

  const handleCancelPress = (item: any) => {
    selectedItemRef = item;
    cancelReasonSheetRef.current?.open();
  };

  const handleShootingCancel = (reason: string) => {
    if (!selectedItemRef) return;

    const applicantId = selectedItemRef?.id;
    const hostId = selectedItemRef?.userId;
    const projectId = selectedItemRef?.projectId;
    
    updateApplicant(
      {
        id: applicantId,
        values: {
          status: "cancel",
          reason,
          updatedAt: new Date(),
        },
      },
      {
        onSuccess: () => {
          createNotification({
            title: "촬영 취소",
            body: `아쉽지만 이번 촬영은 취소되었어요. 곧 더 멋진 촬영이 기다리고 있을 거예요!`,
            userId: hostId,
            data: { type: "shooting", projectId: projectId },
          });
          queryClient.invalidateQueries({ queryKey: ["appliedProjects", profile?.id ?? ""] });
        },
        onError: (error: any) => {
          console.error("촬영 취소 중 오류:", error);
          toast.showError("촬영 취소 실패", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-bg-layer-baasement">
        <Tabs variant="underline">
          <TabItem name="my" title="생성한 모집글">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {myProjects && myProjects.length > 0 ? (
                <FlatList
                  data={myProjects}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <MyProjectCard
                      project={item}
                    />
                  )}
                  contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="heading1-semiBold text-fg-neutral-solid">
                    생성한 모집글이 없어요
                  </Text>
                </View>
              )}
            </KeyboardAvoidingView>
          </TabItem>
          <TabItem name="apply" title="지원한 모집글">
            <Tabs variant="underline">
              <TabItem name="my" title="대기">
                {pendingProjects && pendingProjects.length > 0 ? (
                  <FlatList
                    data={pendingProjects}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <AppliedProjectCard
                        item={item}
                        project={item}
                        onCancelPress={handleCancelPress}
                      />
                    )}
                    contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
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
              </TabItem>
              <TabItem name="apply" title="진행중">
                {inProgressProjects && inProgressProjects.length > 0 ? (
                  <FlatList
                    data={inProgressProjects}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <AppliedProjectCard
                        item={item}
                        project={item}
                        onCancelPress={handleCancelPress}
                      />
                    )}
                    contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
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
              </TabItem>
              <TabItem name="complete" title="완료">
                {doneProjects && doneProjects.length > 0 ? (
                  <FlatList
                    data={doneProjects}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <AppliedProjectCard
                        item={item}
                        project={item}
                        onCancelPress={handleCancelPress}
                      />
                    )}
                    contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
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
              </TabItem>
              <TabItem name="cancel" title="취소">
                {canceledProjects && canceledProjects.length > 0 ? (
                  <FlatList
                    data={canceledProjects}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <AppliedProjectCard
                        item={item}
                        project={item}
                        onCancelPress={handleCancelPress}
                      />
                    )}
                    contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
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
              </TabItem>
            </Tabs>
          </TabItem>
        </Tabs>
      </View>
      <CancelReasonSheet
        ref={cancelReasonSheetRef}
        onConfirm={handleShootingCancel}
      />  
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}
