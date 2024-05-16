interface ISendKeyRegistrationTransactionEventPayload {
  fee?: string;
  firstValidRound?: string;
  genesisHash?: string;
  group?: string;
  lastValidRound?: string;
  lease?: string;
  note?: string;
  rekeyTo?: string;
  sender: string;
  selectionKey?: string;
  stateProofKey?: string;
  voteFirstRound?: string;
  voteKey?: string;
  voteKeyDilution?: string;
  voteLastRound?: string;
}

export default ISendKeyRegistrationTransactionEventPayload;
