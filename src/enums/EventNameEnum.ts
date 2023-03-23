enum EventNameEnum {
  // bridge
  BridgeEnableRequest = 'bridge.enable_request',
  BridgeEnableResponse = 'bridge.enable_response',
  // external
  ExternalEnableRequest = 'external.enable_request',
  ExternalEnableResponse = 'external.enable_response',
  // internal
  ExtensionEnableRequest = 'extension.enable_request',
  ExtensionEnableResponse = 'extension.enable_response',
  ExtensionRegistrationCompleted = 'extension.registration_completed',
}

export default EventNameEnum;
