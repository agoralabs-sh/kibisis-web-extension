interface ISearchApplicationsWithDelayOptions {
  applicationId: string;
  delay: number;
  limit: number;
  next: string | null;
  nodeID: string | null;
}

export default ISearchApplicationsWithDelayOptions;
