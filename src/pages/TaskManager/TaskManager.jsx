import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Card, Tag, Avatar, Modal, Button } from 'antd';
import { taskServ } from '../../services/taskServ';
import { jwtDecode } from 'jwt-decode';
import { employeeServ } from '../../services/employeeServ';
import { ArrowUpIcon } from '../../components/IconSVG/ArrowUpIcon';
import { ArrowDownIcon } from '../../components/IconSVG/ArrowDownIcon';
import { BugIcon } from '../../components/IconSVG/BugIcon';
import { StoryIcon } from '../../components/IconSVG/StoryIcon';
import { TaskIcon } from '../../components/IconSVG/TaskIcon';
import { io } from 'socket.io-client';
import TaskDetail from '../../components/TaskDetail/TaskDetail';
import { PlusOutlined } from '@ant-design/icons';

const socket = io('http://localhost:8081');

const TaskManager = () => {
  const [User_Login, setUserLogin] = useState();
  const { projectId } = useParams();
  const [data, setData] = useState({
    tasks: {},
    columns: {},
    columnOrder: ['column-1', 'column-2', 'column-3'],
  });
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [taskDetail, setTaskDetail] = useState(null); // Task detail state

  useEffect(() => {
    const token = localStorage.getItem('LOGIN_USER');
    const decoded = jwtDecode(token);
    employeeServ.getEmployeeById(decoded.employee_id).then((res) => {
      setUserLogin(res.data.data);
    });

    socket.on('taskStatusUpdated', (updatedTask) => {
      setData((prevData) => {
        const updatedTasks = { ...prevData.tasks };
        const taskId = `task-${updatedTask.task_id}`;
        updatedTasks[taskId] = { ...updatedTasks[taskId], ...updatedTask };

        return { ...prevData, tasks: updatedTasks };
      });
    });
  }, [User_Login]);

  useEffect(() => {
    taskServ.getTasksByProject(projectId).then(async (res) => {
      const tasks = {};
      const backlogTaskIds = [];
      const inProgressTaskIds = [];
      const doneTaskIds = [];

      const userPromises = res.data.map(async (task) => {
        const userRes = await employeeServ.getEmployeeById(task.assigned_to);
        const user = userRes.data.data;

        const taskId = `task-${task.task_id}`;
        tasks[taskId] = {
          taskID: task.task_id,
          status_task: task.status_task,
          task_title: task.task_name,
          priority: task.priority,
          assigned_to: user,
          id: taskId,
          content: `${task.description || 'No description'}`,
          type: task.status,
        };

        switch (task.status) {
          case 'Backlog':
            backlogTaskIds.push(taskId);
            break;
          case 'In Progress':
            inProgressTaskIds.push(taskId);
            break;
          case 'Done':
            doneTaskIds.push(taskId);
            break;
          default:
            break;
        }
      });

      await Promise.all(userPromises);

      const columns = {
        'column-1': {
          id: 'column-1',
          title: 'Backlog',
          taskIds: backlogTaskIds,
        },
        'column-2': {
          id: 'column-2',
          title: 'In Progress',
          taskIds: inProgressTaskIds,
        },
        'column-3': {
          id: 'column-3',
          title: 'Done',
          taskIds: doneTaskIds,
        },
      };

      setData({
        tasks,
        columns,
        columnOrder: ['column-1', 'column-2', 'column-3'],
      });
    });
  }, [projectId]);

  if (!data || !data.columnOrder) return <div>Loading...</div>;

  // Hàm xử lý khi kéo-thả kết thúc
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Xử lý di chuyển task trong cùng một cột
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      const newData = {
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      };
      setData(newData);
      return;
    }

    // Xử lý di chuyển task giữa các cột khác nhau
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newData);

    // Gọi API để cập nhật trạng thái của task
    try {
      await taskServ.updateTaskStatus(
        parseInt(draggableId.split('-')[1]), // Lấy task_id từ draggableId
        finish.title // Giả định rằng tiêu đề cột là trạng thái mới
      );
    } catch (error) {
      console.error('Không thể cập nhật trạng thái của task', error);
    }
  };

  // Hàm hiển thị chi tiết task và mở modal
  const showTaskDetail = async (taskId) => {
    try {
      const response = await taskServ.getTaskDetail(taskId);
      setTaskDetail(response.data); // Lưu dữ liệu chi tiết của task
      setIsModalVisible(true); // Hiển thị modal
    } catch (error) {
      console.error('Không thể lấy chi tiết task', error);
    }
  };

  // Hàm đóng modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setTaskDetail(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Button type="primary" icon={<PlusOutlined />} className="mb-4 py-5">
        Add Task
      </Button>
      <div className="grid grid-cols-3 gap-4 p-4">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          if (!column) return null;

          const tasks = column.taskIds
            ? column.taskIds.map((taskId) => data.tasks[taskId] || {})
            : [];

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
                  {tasks.map((task, index) => {
                    if (!task.id) return null;

                    return (
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
                            onClick={() => showTaskDetail(task.taskID)} // Handle click
                          >
                            <Card
                              title={task.task_title}
                              extra={
                                <Avatar
                                  size="small"
                                  src={`http://localhost:8080/public/img/${task.assigned_to?.avatar}`}
                                  alt={task.assigned_to?.name}
                                />
                              }
                              hoverable
                            >
                              {task.content}
                              <div className="mt-2 flex justify-between items-center">
                                <Tag
                                  color={
                                    task.status_task === 'TASK'
                                      ? 'blue'
                                      : task.status_task === 'STORY'
                                      ? 'green'
                                      : 'red'
                                  }
                                >
                                  {task.status_task} - {task.taskID}
                                </Tag>
                                <div className="flex items-center justify-between mt-2">
                                  <div>{getTaskIcon(task.status_task)}</div>
                                  <div>{getPriorityIcon(task.priority)}</div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  {snapshot.isDraggingOver && (
                    <div className="h-16 border border-dashed border-blue-500 rounded-lg mb-2"></div>
                  )}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>

      <Modal
        title="Task Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={1000}
      >
        {taskDetail ? <TaskDetail task={taskDetail} /> : <div>Loading...</div>}
      </Modal>
    </DragDropContext>
  );
};

export default TaskManager;

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'Highest':
      return (
        <div style={{ color: 'red' }}>
          <ArrowUpIcon />
        </div>
      );
    case 'High':
      return (
        <div style={{ color: 'red' }}>
          <ArrowUpIcon />
        </div>
      );
    case 'Medium':
      return (
        <div style={{ color: 'orange' }}>
          <ArrowUpIcon />
        </div>
      );
    case 'Low':
      return (
        <div style={{ color: 'green' }}>
          <ArrowDownIcon />
        </div>
      );
    case 'Lowest':
      return (
        <div style={{ color: 'green' }}>
          <ArrowDownIcon />
        </div>
      );
    default:
      return null;
  }
};

const getTaskIcon = (statusTask) => {
  switch (statusTask) {
    case 'BUG':
      return <BugIcon />;
    case 'STORY':
      return <StoryIcon />;
    case 'TASK':
      return <TaskIcon />;
    default:
      return null;
  }
};
