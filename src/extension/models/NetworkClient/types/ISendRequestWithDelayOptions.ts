interface ISendRequestWithDelayOptions<Result> {
  delay?: number;
  request: () => Promise<Result>;
}

export default ISendRequestWithDelayOptions;
