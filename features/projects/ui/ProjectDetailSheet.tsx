import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ProjectCard } from "./ProjectCard";

export type ProjectDetailSheetRef = {
  open: () => void;
  close: () => void;
};


const ProjectDetailSheet = forwardRef<ProjectDetailSheetRef>(
  ({ project, }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [index, setIndex] = useState(0);
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
  }));

  const router = useRouter();

  const handlePressProject = (item) => {
    router.replace(`/project/${item.id}/edit`);
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
        <ProjectCard project={project} onPress={() => handlePressProject(project)}/>
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
