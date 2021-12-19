interface DragAndDropListModel {
  listId: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  list?: { id: string; name: string; [key: string]: any }[];
  direction?: 'vertical' | 'horizontal';
}

export default DragAndDropListModel;
