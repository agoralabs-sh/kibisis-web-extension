interface IScanQRCodeModalContentProps {
  onPreviousClick: () => void;
  onURI: (uri: string) => void;
  pagination?: [number, number];
}

export default IScanQRCodeModalContentProps;
