import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import DragAndDropListModel from './drag-and-drop-list-model';

const DragAndDropList = (props: DragAndDropListModel) => {
  return (
    <Droppable
      droppableId={props.listId}
      type={props.listType}
      direction='horizontal'
      isCombineEnabled={false}
    >
      {(dropProvided) => (
        <div {...dropProvided.droppableProps}>
          <div>
            <div>
              <div style={{ display: 'flex' }} ref={dropProvided.innerRef}>
                {props.beeHives?.map((beeHive, index) => (
                  <Draggable
                    key={beeHive.id}
                    draggableId={beeHive.id}
                    index={index}
                  >
                    {(dragProvided) => (
                      <div
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        ref={dragProvided.innerRef}
                      >
                        {beeHive.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DragAndDropList;
