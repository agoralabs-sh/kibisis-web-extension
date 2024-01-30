enum InternalMessageReferenceEnum {
  // messages sent from the extension internally within the extension
  FactoryReset = 'internal:factory_reset',
  EventAdded = 'internal:event_added',
  PasswordLockUpdated = 'internal:password_lock_updated',
  RegistrationCompleted = 'internal:registration_completed',
}

export default InternalMessageReferenceEnum;
