import { Avatar, Card, Tag } from 'antd';
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const TaskManager = () => {
  const [data, setData] = useState(initialData);

  // Function to handle drag and drop
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newData);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`bg-gray-100 rounded-[6px] shadow-md p-4 ${
                    snapshot.isDraggingOver ? '!bg-blue-100' : ''
                  }`}
                >
                  <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-4 ${
                            snapshot.isDragging
                              ? 'border border-dashed border-blue-500'
                              : ''
                          }`}
                        >
                          <Card
                            title={taskTypeIcons[task.type]}
                            extra={
                              <Avatar
                                size="small"
                                src={`https://randomuser.me/api/portraits/men/${
                                  index + 10
                                }.jpg`}
                              />
                            }
                            hoverable
                          >
                            {task.content}
                            <div className="mt-2">
                              <Tag
                                color={task.type === 'TASK' ? 'blue' : 'red'}
                              >
                                {task.type === 'TASK' ? 'Task' : 'Story'}
                              </Tag>
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {/* Custom Placeholder for drop area */}
                  {snapshot.isDraggingOver && (
                    <div className="h-16 border border-dashed border-blue-500 rounded-lg mb-2"></div>
                  )}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskManager;

const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Design the UI/UX for the project',
      type: 'TASK',
      assignee: 'user1',
      status: 'Backlog',
    },
    'task-2': {
      id: 'task-2',
      content: 'AWS Management Console',
      type: 'STORY',
      assignee: 'user2',
      status: 'Backlog',
    },
    'task-3': {
      id: 'task-3',
      content: 'Create a new project',
      type: 'TASK',
      assignee: 'user3',
      status: 'Backlog',
    },
    'task-4': {
      id: 'task-4',
      content: 'Prepare backend API with GraphQL',
      type: 'STORY',
      assignee: 'user1',
      status: 'In Progress',
    },
    'task-5': {
      id: 'task-5',
      content: 'Set up project structure',
      type: 'TASK',
      assignee: 'user2',
      status: 'Done',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Backlog',
      taskIds: ['task-1', 'task-2', 'task-3'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const taskTypeIcons = {
  TASK: <i className="fa-brands fa-aws" style={{ color: '#1890ff' }} />,
  STORY: <i className="fa-brands fa-aws" style={{ color: '#f5222d' }} />,
};
