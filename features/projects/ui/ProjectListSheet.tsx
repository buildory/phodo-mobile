import React, {
  useRef,
  useMemo ,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ProjectCard } from "./ProjectCard";
import { RecruitTypeBadge } from "./RecruitTypeBadge";

export type ProjectListSheetRef = {
  open: (index: number) => void;
  close: () => void;
};

const ProjectListSheet = forwardRef<ProjectListSheetRef>(
  ({ projects, selected, onSelect }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["13%", "85%"], []);

    const router = useRouter();
    useImperativeHandle(ref, () => ({
      open: (index = 0) => bottomSheetRef.current?.snapToIndex(index),
      close: () => bottomSheetRef.current?.close(),
    }));

    const handlePressProject = (item) => {
      router.push(`/project/${item.id}/edit`);
    }

    return (
      <BottomSheet
        index={0}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableContentPanningGesture={false}
        enablePanDownToClose={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
          <RecruitTypeBadge
            selected={selected}
            onSelect={onSelect}
          />
            <FlatList
              data={projects}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProjectCard project={item} onPress={() => handlePressProject(item)}/>}
              contentContainerStyle={styles.flatListContent}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            />
          </KeyboardAvoidingView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default ProjectListSheet;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flatListContent: {
    gap: 20,
    paddingBottom: 20
  },
});
