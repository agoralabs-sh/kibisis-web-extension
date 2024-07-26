interface IProps {
  address: string;
  isEditing: boolean;
  isLoading: boolean;
  name: string | null;
  onCancel: () => void;
  onSubmitChange: (value: string | null) => void;
}

export default IProps;
