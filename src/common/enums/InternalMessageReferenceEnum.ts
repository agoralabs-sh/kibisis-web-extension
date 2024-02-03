enum InternalMessageReferenceEnum {
  // messages sent from the extension internally within the extension
  FactoryReset = 'internal:factory_reset',
  EventAdded = 'internal:event_added',
  PasswordLockClear = 'internal:password_lock_clear',
  PasswordLockTimeout = 'internal:password_lock_timeout',
  RegistrationCompleted = 'internal:registration_completed',
}

export default InternalMessageReferenceEnum;
