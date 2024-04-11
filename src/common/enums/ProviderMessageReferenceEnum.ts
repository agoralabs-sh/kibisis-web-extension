enum ProviderMessageReferenceEnum {
  // messages sent from the extension internally within the extension
  FactoryReset = 'provider:factory_reset',
  EventAdded = 'provider:event_added',
  PasswordLockClear = 'provider:password_lock_clear',
  PasswordLockTimeout = 'provider:password_lock_timeout',
  RegistrationCompleted = 'provider:registration_completed',
}

export default ProviderMessageReferenceEnum;
