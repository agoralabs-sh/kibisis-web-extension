enum EventNameEnum {
  // external
  ExternalEnableRequest = 'external.enable_request',
  ExternalEnableResponse = 'external.enable_response',
  ExternalSignBytesRequest = 'external.sign_bytes_request',
  ExternalSignBytesResponse = 'external.sign_bytes_response',
  ExternalSignTxnsRequest = 'external.sign_txns_request',
  ExternalSignTxnsResponse = 'external.sign_txns_response',
  // internal
  ExtensionBackgroundAppLoad = 'extension.background_app_load',
  ExtensionEnableRequest = 'extension.enable_request',
  ExtensionEnableResponse = 'extension.enable_response',
  ExtensionRegistrationCompleted = 'extension.registration_completed',
  ExtensionReset = 'extension.reset',
  ExtensionSignBytesRequest = 'extension.sign_bytes_request',
  ExtensionSignBytesResponse = 'extension.sign_bytes_response',
  ExtensionSignTxnsRequest = 'extension.sign_txns_request',
  ExtensionSignTxnsResponse = 'extension.sign_txns_response',
}

export default EventNameEnum;
