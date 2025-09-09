import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import {
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ProjectCard } from "./ProjectCard";
import { useBottomSheet } from "@/shared/providers/BottomSheetProvider";
import { BOTTOM_SHEET_IDS } from "@/shared/hooks/useBottomSheetManager";

export type ProjectDetailSheetRef = {
  open: () => void;
  close: () => void;
};

const ProjectDetailSheet = forwardRef<ProjectDetailSheetRef>(
  ({ project, mylocation }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { registerSheet, unregisterSheet, openSheet, closeSheet } = useBottomSheet();
    const [index, setIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      open: () => openSheet(BOTTOM_SHEET_IDS.PROJECT_DETAIL, 0),
      close: () => closeSheet(BOTTOM_SHEET_IDS.PROJECT_DETAIL),
    }));

    useEffect(() => {
      registerSheet(BOTTOM_SHEET_IDS.PROJECT_DETAIL, bottomSheetRef);
      return () => unregisterSheet(BOTTOM_SHEET_IDS.PROJECT_DETAIL);
    }, [registerSheet, unregisterSheet]);

  const router = useRouter();

  const handlePressProject = (item) => {
    router.push(`/project/${item.id}/edit`);
  }

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        onChange={(index) => setIndex(index)}
        snapPoints={["65%"]}
        enablePanDownToClose={true}
      >
      <BottomSheetView style={styles.container}>
        <ProjectCard project={project} myLocation={mylocation} onPress={() => handlePressProject(project)}/>
      </BottomSheetView>
      </BottomSheet>
    );
  }
);

export default ProjectDetailSheet;

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 20,
  },
});
