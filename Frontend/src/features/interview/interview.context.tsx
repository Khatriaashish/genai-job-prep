import { createContext, useState, ReactNode } from "react";

export interface InterviewReport {
  _id?: string;
  title?: string;
  matchScore?: number;
  technicalQuestions?: any[];
  behavioralQuestions?: any[];
  preparationPlan?: any[];
  skillGaps?: any[];
  createdAt?: string;
}

interface InterviewContextType {
  loading: boolean;
  setLoading: (b: boolean) => void;
  report: InterviewReport | null;
  setReport: (r: InterviewReport | null) => void;
  reports: InterviewReport[];
  setReports: (r: InterviewReport[]) => void;
}

export const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined,
);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [reports, setReports] = useState<InterviewReport[]>([]);

  return (
    <InterviewContext.Provider
      value={{ loading, setLoading, report, setReport, reports, setReports }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
