export interface Education {
  id: string;
  schoolName: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface CandidateSkill {
  id: string;
  skillId: string;
  skill: Skill;
}

export interface Candidate {
  id: string;
  userId: string;
  bio?: Record<string, string>;
  currentCvUrl?: string;
  isSearching: boolean;
  educations?: Education[];
  experiences?: Experience[];
  candidateSkills?: CandidateSkill[];
}
