enum MessageTypeEnum {
  // messages sent from the extension (internally within the extension or out to the content script)
  EnableResponse = 'message.enable_response',
  FactoryReset = 'message.factory_reset',
  EventAdded = 'message.event_added',
  RegistrationCompleted = 'message.registration_completed',
  SignBytesResponse = 'message.sign_bytes_response',
  SignTxnsResponse = 'message.sign_txns_response',

  // messages sent from the web page (brokered through the content scripts)
  EnableRequest = 'message.enable_request',
  SignBytesRequest = 'message.sign_bytes_request',
  SignTxnsRequest = 'message.sign_txns_request',
}

export default MessageTypeEnum;
