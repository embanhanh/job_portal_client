import { CardContent } from "@/components/ui/card";
import type { User as UserType } from "@/features/auth/types/auth.type";
import { Separator } from "@/components/ui/separator";
import { CandidateBioSection } from "./CandidateBioSection";
import { CandidateCvSection } from "./CandidateCvSection";
import { CandidateEducationSection } from "./CandidateEducationSection";
import { CandidateExperienceSection } from "./CandidateExperienceSection";
import { CandidateSkillsSection } from "./CandidateSkillsSection";
import { CandidateSearchingStatus } from "./CandidateSearchingStatus";

interface ProfileInfoTabProps {
  user: UserType;
}

export async function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  return (
    <CardContent className="p-0 space-y-8">
      <div className="space-y-10">
        <CandidateSearchingStatus isSearching={user.candidate.isSearching} />

        <Separator />

        <CandidateBioSection bio={user.candidate.bio} />

        <Separator />

        <CandidateCvSection cvUrl={user.candidate.currentCvUrl} />

        <Separator />

        <CandidateEducationSection educations={user.candidate.educations} />

        <Separator />

        <CandidateExperienceSection experiences={user.candidate.experiences} />

        <Separator />

        <CandidateSkillsSection skills={user.candidate.candidateSkills} />
      </div>
    </CardContent>
  );
}
