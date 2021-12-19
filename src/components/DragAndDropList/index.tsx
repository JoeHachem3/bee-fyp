import { Droppable, Draggable } from 'react-beautiful-dnd';
import DragAndDropListModel from './drag-and-drop-list-model';
import { Card, CardContent, Typography } from '@mui/material';

const DragAndDropList = (props: DragAndDropListModel) => {
  return (
    <Droppable
      droppableId={props.listId}
      type={props.listType}
      direction={props.direction || 'vertical'}
      isCombineEnabled={false}
    >
      {(dropProvided) => (
        <div {...dropProvided.droppableProps} style={{ height: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection:
                props.direction === 'horizontal' ? 'row' : 'column',
              height: '100%',
              flexWrap: 'wrap',
            }}
            ref={dropProvided.innerRef}
          >
            {props.list?.map(
              (item, index) =>
                item && (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(dragProvided) => (
                      <Card
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        ref={dragProvided.innerRef}
                        sx={{
                          backgroundColor: 'var(--color-background)',
                          margin: '0.25rem',
                          height: 'min-content',
                        }}
                      >
                        <CardContent sx={{ padding: '0.5rem !important' }}>
                          <Typography sx={{ color: 'var(--color-text)' }}>
                            {item.name}
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ),
            )}
            {dropProvided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DragAndDropList;
