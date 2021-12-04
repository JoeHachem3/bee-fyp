import { BeeHiveModel } from '../../database/models';

interface DragAndDropListModel {
  listId: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  beeHives?: BeeHiveModel[];
  direction?: 'vertical' | 'horizontal';
}

export default DragAndDropListModel;
