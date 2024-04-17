export interface ReportBugBodyPayload {
  title: string;
  description: string;
  url: string;
  userIdentifier: string;
}

export interface ReportBugReview {
  status: "approved" | "rejected";
  reviewerComment: string;
  reportId: string;
}

export type DBNames = "bug_report" | "review_report";
