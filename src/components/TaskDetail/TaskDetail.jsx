import React, { Fragment, useState } from 'react';
import { Tag, Avatar, Button, Select } from 'antd';
import { BugIcon } from '../../components/IconSVG/BugIcon';
import { StoryIcon } from '../../components/IconSVG/StoryIcon';
import { TaskIcon } from '../../components/IconSVG/TaskIcon';
import { ArrowDownIcon } from '../IconSVG/ArrowDownIcon';
import { ArrowUpIcon } from '../IconSVG/ArrowUpIcon';

const { Option } = Select;

const TaskDetail = ({ task }) => {
  const [taskType, setTaskType] = useState('STORY');
  const [isEditingTaskType, setIsEditingTaskType] = useState(false);
  const [status, setStatus] = useState('IN PROGRESS');
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [priority, setPriority] = useState('Highest');
  const [isEditingPriority, setIsEditingPriority] = useState(false);

  if (!task) return <div>Loading...</div>;

  const handleTaskTypeChange = (value) => {
    setTaskType(value);
    setIsEditingTaskType(false);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setIsEditingStatus(false);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    setIsEditingPriority(false);
  };

  return (
    <Fragment>
      <div className="border-b pb-4 mb-4">
        {isEditingTaskType ? (
          <Select
            value={taskType}
            onChange={handleTaskTypeChange}
            className="w-32"
            onBlur={() => setIsEditingTaskType(false)}
          >
            <Option value="STORY">
              <div className="flex">
                <div className="mr-2">
                  <StoryIcon />
                </div>
                Story
              </div>
            </Option>
            <Option value="TASK">
              <div className="flex">
                <div className="mr-2">
                  <TaskIcon />
                </div>
                Task
              </div>
            </Option>
            <Option value="BUG">
              <div className="flex">
                <div className="mr-2">
                  <BugIcon />
                </div>
                Bug
              </div>
            </Option>
          </Select>
        ) : (
          <Tag
            color={getTaskTypeColor(taskType)}
            className="w-28 p-2 mb-2 cursor-pointer flex items-center"
            onClick={() => setIsEditingTaskType(true)}
          >
            {getTaskIcon(taskType)}
            <span className="ml-2">
              {taskType}-{task.task_id}
            </span>
          </Tag>
        )}
        <h2 className="text-2xl font-bold mb-1">{task.task_name}</h2>
        <p className="text-gray-600">{task.description} </p>
      </div>
      <div className="flex justify-between gap-10">
        <div className="w-2/3">
          <h2 className="font-medium text-base text-gray-500 mb-2">
            Description
          </h2>
          <div>
            I have prepared a set of tutorial for some major components of Jira
            clone, feel free to take a look! More to come, the tutorials will
            have at least 10 posts 😊😊😊
          </div>
          <ol className="list-decimal text-blue-500 ml-10 my-5">
            <li>Prerequisites</li>
            <li>
              Create a new repository and set up a new Angular application with
              CLI Build the application layout with flex and TailwindCSS
            </li>
            <li>Setup Akita state management</li>
            <li>Build an editable textbox</li>
            <li>Build an interactive drag and drop board</li>
            <li>Build a markdown text editor</li>
            <li>Build a rich text HTML editor</li>
            <li>Build a placeholder loading</li>
          </ol>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold">Status</h4>
            {isEditingStatus ? (
              <Select
                value={status}
                onChange={handleStatusChange}
                className="w-full mt-1"
                onBlur={() => setIsEditingStatus(false)}
              >
                <Option value="Backlog">Backlog</Option>
                <Option value="IN PROGRESS">In Progress</Option>
                <Option value="Done">Done</Option>
              </Select>
            ) : (
              <p
                className="mt-1 cursor-pointer"
                onClick={() => setIsEditingStatus(true)}
              >
                {status}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-semibold">Reporter</h4>
            <div className="flex items-center mt-1">
              <Avatar src="avatar_url_here" className="mr-2" />
              <span>Cao Sơn</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Assignees</h4>
            <div className="flex items-center mt-1">
              <Avatar src="avatar_url_here" className="mr-2" />
              <span>Cao Sơn</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold">Priority</h4>
            {isEditingPriority ? (
              <Select
                value={priority}
                onChange={handlePriorityChange}
                className="w-36 mt-1"
                onBlur={() => setIsEditingPriority(false)}
              >
                <Option value="Highest">
                  <div className="flex">
                    <div style={{ color: 'red', marginRight: '2px' }}>
                      <ArrowUpIcon />
                    </div>
                    Highest
                  </div>
                </Option>
                <Option value="High">
                  <div className="flex">
                    <div style={{ color: 'red', marginRight: '2px' }}>
                      <ArrowUpIcon />
                    </div>
                    High
                  </div>
                </Option>
                <Option value="Medium">
                  <div className="flex">
                    <div style={{ color: 'orange', marginRight: '2px' }}>
                      <ArrowUpIcon />
                    </div>
                    Medium
                  </div>
                </Option>
                <Option value="Low">
                  <div className="flex">
                    <div style={{ color: 'green', marginRight: '2px' }}>
                      <ArrowDownIcon />
                    </div>
                    Low
                  </div>
                </Option>
                <Option value="Lowest">
                  <div className="flex">
                    <div style={{ color: 'green', marginRight: '2px' }}>
                      <ArrowDownIcon />
                    </div>
                    Lowest
                  </div>
                </Option>
              </Select>
            ) : (
              <Tag
                color={getPriorityColor(priority)}
                className="w-24 py-2 flex items-center cursor-pointer"
                onClick={() => setIsEditingPriority(true)}
              >
                {getPriorityIcon(priority)}
                <span className="ml-2">{priority}</span>
              </Tag>
            )}
          </div>
          <div>
            <h4 className="font-semibold">Created</h4>
            <p className="text-gray-600 mt-1">Oct 16, 2024, 6:41:37 AM</p>
          </div>
          <div>
            <h4 className="font-semibold">Updated</h4>
            <p className="text-gray-600 mt-1">Sep 4, 2024, 6:41:37 AM</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Comments</h3>
        <div className="flex items-center mb-4">
          <Avatar src="avatar_url_here" className="mr-3" />
          <input
            type="text"
            placeholder="Add a comment"
            className="flex-1 p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </Fragment>
  );
};

export default TaskDetail;

// Hàm lấy icon ưu tiên
const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'Highest':
      return <ArrowUpIcon style={{ color: 'red' }} />;
    case 'High':
      return <ArrowUpIcon style={{ color: 'red' }} />;
    case 'Medium':
      return <ArrowUpIcon style={{ color: 'orange' }} />;
    case 'Low':
      return <ArrowDownIcon style={{ color: 'green' }} />;
    case 'Lowest':
      return <ArrowDownIcon style={{ color: 'green' }} />;
    default:
      return null;
  }
};

// Hàm lấy icon loại task
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

// Lấy màu sắc dựa vào `taskType`
const getTaskTypeColor = (type) => {
  switch (type) {
    case 'STORY':
      return 'green';
    case 'TASK':
      return 'blue';
    case 'BUG':
      return 'red';
    default:
      return 'gray';
  }
};

// Lấy màu sắc dựa vào `priority`
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Highest':
      return 'red';
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'green';
    case 'Lowest':
      return 'green';
    default:
      return 'gray';
  }
};
