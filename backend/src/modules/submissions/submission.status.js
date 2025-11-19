export const SubmissionStatuses = {
  Draft: "draft",
  Submitted: "submitted",
  UnderReview: "under_review",
  MoreInfo: "more_info_required",
  Approved: "approved",
  Rejected: "rejected",
  Revoked: "revoked",
};

export function canEdit(submission) {
  return [SubmissionStatuses.Draft, SubmissionStatuses.MoreInfo].includes(
    submission.status
  );
}

export function canSubmit(submission) {
  return [SubmissionStatuses.Draft, SubmissionStatuses.MoreInfo].includes(
    submission.status
  );
}

export function canTriage(submission) {
  return [SubmissionStatuses.Submitted].includes(submission.status);
}

export function canDecide(submission) {
  return [SubmissionStatuses.UnderReview].includes(submission.status);
}
