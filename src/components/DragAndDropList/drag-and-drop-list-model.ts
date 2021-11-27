import { BeeHiveModel } from '../../database/models';

interface DragAndDropListModel {
  listId: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  beeHives?: BeeHiveModel[];
}

export default DragAndDropListModel;
