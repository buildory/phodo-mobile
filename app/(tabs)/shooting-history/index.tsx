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
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { Tabs, TabItem } from "@/shared/ui/Tabs";
import { View } from "react-native";
import MyProjectCard from "@/features/projects/ui/MyProjectCard";
import AppliedProjectCard from "@/features/projects/ui/AppliedProjectCard";

export default function ShootingHistoryScreen() {
  const { profile } = useCurrentUserStore();
  const { data: myProjects } = useMyProjects(profile?.id ?? "");
  const { data: appliedProjects } = useAppliedProjects(profile?.id ?? "");

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

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <View className="flex-1 bg-bg-layer-baasement">
        <Tabs variant="underline">
          <TabItem name="my" title="생성한 모집글">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
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
            </KeyboardAvoidingView>
          </TabItem>
          <TabItem name="apply" title="지원한 모집글">
            <Tabs variant="underline">
              <TabItem name="my" title="대기">
                <FlatList
                  data={pendingProjects}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <AppliedProjectCard
                      project={item}
                    />
                  )}
                  contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              </TabItem>
              <TabItem name="apply" title="진행중">
                <FlatList
                  data={inProgressProjects}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <AppliedProjectCard
                      project={item}
                    />
                  )}
                  contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              </TabItem>
              <TabItem name="complete" title="완료">
                <FlatList
                  data={doneProjects}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <AppliedProjectCard
                      project={item}
                    />
                  )}
                  contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              </TabItem>
              <TabItem name="cancel" title="취소">
                <FlatList
                  data={canceledProjects}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <AppliedProjectCard
                      project={item}
                    />
                  )}
                  contentContainerStyle={{ gap: 20, paddingVertical: 20 }}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              </TabItem>
            </Tabs>
          </TabItem>
        </Tabs>
      </View>
    </SafeAreaView>
  );
}
