import PendingAppliedProjectCard from "./PendingAppliedProjectCard";
import ReadyAppliedProjectCard from "./ReadyAppliedProjectCard";
import ShootingAppliedProjectCard from "./ShootingAppliedProjectCard";
import ReviewAppliedProjectCard from "./ReviewAppliedProjectCard";
import CompletedAppliedProjectCard from "./CompletedAppliedProjectCard";
import CancelledAppliedProjectCard from "./CancelledAppliedProjectCard";

interface AppliedProjectCardProps {
  item: any;
  project: any;
  onCancelPress?: (item: any) => void;
}

export default function AppliedProjectCard({ item, project, onCancelPress }: AppliedProjectCardProps) {
  const status = project?.status;

  // 상태별로 적절한 컴포넌트 렌더링
  switch (status) {
    case "pending":
      return <PendingAppliedProjectCard item={item} project={project} />;
    
    case "ready":
      return <ReadyAppliedProjectCard item={item} project={project} onCancelPress={onCancelPress} />;
    
    case "shooting":
      return <ShootingAppliedProjectCard item={item} project={project} />;
    
    case "review":
      return <ReviewAppliedProjectCard item={item} project={project} />;
    
    case "done":
      return <CompletedAppliedProjectCard item={item} project={project} />;
    
    case "cancel":
      return <CancelledAppliedProjectCard item={item} project={project} />;
    
    default:
      return <PendingAppliedProjectCard item={item} project={project} />;
  }
}
