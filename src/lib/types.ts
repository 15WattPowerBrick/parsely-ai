// src/lib/types.ts

export type Education = {
  School: string;
  Qualification: string;
  MajorDepartment: string;
  From: string;
  To: string;
};

export type WorkExperience = {
  Company: string;
  JobTitle: string;
  Summary: { Description: string }[];
  ReasonForLeaving: string;
  From: string;
  To: string;
};

export type ParsedResume = {
  Name: string;
  DateOfBirth: string;
  Age: string;
  Gender: string;
  Race: string;
  Nationality: string;
  Residency: string;
  NoticePeriod: string;
  Mobile: string;
  Email: string;
  Education: Education[];
  WorkExperience: WorkExperience[];
};
