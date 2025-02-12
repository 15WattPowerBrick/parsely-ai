export interface ResumeData {
  Name?: string;
  DateOfBirth?: string | null;
  Age?: number | null;
  Gender?: string | null;
  Nationality?: string | null;
  Residency?: string | null;
  NoticePeriod?: string | null;
  Mobile?: string;
  Email?: string;
  ProfileSummary?: string;
  Language?: string;
  Skills?: string;
  Education?: {
    School: string;
    Qualification: string;
    Major?: string | null;
    From: string;
    To: string;
  }[];
  WorkExperience?: {
    Company: string;
    JobTitle: string;
    Summary?: { Description: string }[];
    LeavingReason: string;
    From: string;
    To?: string | null;
  }[];
}
