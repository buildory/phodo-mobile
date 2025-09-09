import React, { useRef, useMemo, useImperativeHandle, forwardRef, useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProjectCard } from "./ProjectCard";
import { RecruitTypeBadge } from "./RecruitTypeBadge";
import { useBottomSheet } from "@/shared/providers/BottomSheetProvider";
import { BOTTOM_SHEET_IDS } from "@/shared/hooks/useBottomSheetManager";

export type ProjectListSheetRef = { open: (index: number) => void; close: () => void; };

interface Props {
  projects: any[];
  selected: any;
  onSelect: (type: any) => void;
  myLocation: { latitude: number; longitude: number } | null;
}

const ProjectListSheet = forwardRef<ProjectListSheetRef, Props>(
  ({ projects, selected, onSelect, myLocation }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { registerSheet, unregisterSheet, openSheet, closeSheet } = useBottomSheet();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const H = Dimensions.get("window").height;

    const snapPoints = useMemo(() => [0.13 * H, 0.80 * H], [H]);

    useImperativeHandle(ref, () => ({
      open: (index = 0) => openSheet(BOTTOM_SHEET_IDS.PROJECT_LIST, index),
      close: () => closeSheet(BOTTOM_SHEET_IDS.PROJECT_LIST),
    }));

    // Sheet 등록/해제
    useEffect(() => {
      registerSheet(BOTTOM_SHEET_IDS.PROJECT_LIST, bottomSheetRef);
      return () => unregisterSheet(BOTTOM_SHEET_IDS.PROJECT_LIST);
    }, [registerSheet, unregisterSheet]);

    const handlePressProject = (item: any) => router.push(`/project/${item.id}/edit`);

    return (
      <BottomSheet
      maxDynamicContentSize={0.80 * H}
        ref={bottomSheetRef}
        index={0}                         
        snapPoints={snapPoints}
        topInset={insets.top}
        enablePanDownToClose={false}
        enableOverDrag={false}            
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
      >
        <BottomSheetFlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              myLocation={myLocation}
              onPress={() => handlePressProject(item)}
            />
          )}
          ListHeaderComponent={
            <RecruitTypeBadge selected={selected} onSelect={onSelect} />
          }
          stickyHeaderIndices={[0]}
          ListHeaderComponentStyle={styles.stickyHeader}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </BottomSheet>
    );
  }
);

export default ProjectListSheet;

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: "white",
    height: 80,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 20,
  },
});
