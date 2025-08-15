import {
  SafeAreaView,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useApplicants } from "@/entities/projects/model/useApplicants";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import ApplicantCard from "@/features/projects/ui/ApplicantCard";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import { useProject } from "@/entities/projects/model";

export default function ApplicantScreen() {
  const { id } = useLocalSearchParams();
  const { data: applicants } = useApplicants(Number(id));
  const { data: project } = useProject(String(id));

  const pendingApplicants = applicants?.filter(
    (p) =>
      p.status === "pending" || p.status === "ready" || p.status === "review"
  );

  const inProgressApplicants = applicants?.filter(
    (p) => p.status === "shooting"
  );

  const doneApplicants = applicants?.filter((p) => p.status === "done");

  const canceledApplicants = applicants?.filter((p) => p.status === "cancel");
  return (
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
                    <ApplicantCard item={item} project={project} />
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
                    <ApplicantCard item={item} project={project} />
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
                    <ApplicantCard item={item} project={project} />
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
                    <ApplicantCard item={item} project={project}/>
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
  );
}
