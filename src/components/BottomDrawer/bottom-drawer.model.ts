interface BottomDrawerModel {
  open?: boolean;
  onClose?: () => any;
  title?: string;
  children?: React.ReactElement;
  additionalIconButtons?: { icon: any; onClick: () => any }[];
}

export default BottomDrawerModel;
