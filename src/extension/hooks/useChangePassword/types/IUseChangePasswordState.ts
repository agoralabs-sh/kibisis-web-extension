interface IUseChangePasswordState {
  changePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<void>;
  error: string | null;
  saving: boolean;
}

export default IUseChangePasswordState;
