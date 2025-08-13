import PendingApplicantCard from "./PendingApplicantCard";
import ShootingApplicantCard from "./ShootingApplicantCard";
import CompletedApplicantCard from "./CompletedApplicantCard";
import CancelledApplicantCard from "./CancelledApplicantCard";

interface ApplicantCardProps {
  item: any;
  project: any;
}

export default function ApplicantCard({ item, project }: ApplicantCardProps) {
  const status = item?.status;

  // 상태별로 적절한 컴포넌트 렌더링
  switch (status) {
    case "pending":
    case "ready":
      return <PendingApplicantCard item={item} project={project} />;
    
    case "shooting":
      return <ShootingApplicantCard item={item} project={project} />;
    
    case "review":
    case "done":
      return <CompletedApplicantCard item={item} project={project} />;
    
    case "cancel":
      return <CancelledApplicantCard item={item} project={project} />;
    
    default:
      return <PendingApplicantCard item={item} project={project} />;
  }
}
