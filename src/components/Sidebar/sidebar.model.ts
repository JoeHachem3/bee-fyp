function onOpen() {
  console.log('No function assigned to SidebarModel.onOpen');
}

function onClose() {
  console.log('No function assigned to SidebarModel.onClose');
}

class SidebarModel {
  anchor?: 'left' | 'right';
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  children?: React.ReactElement;

  constructor(props: SidebarModel) {
    return {
      anchor: props.anchor || 'right',
      open: !!props.open,
      onOpen: props.onOpen || onOpen,
      onClose: props.onClose || onClose,
    };
  }
}

export default SidebarModel;
