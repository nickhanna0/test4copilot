import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TeamMember, ColumnId } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import './Column.css';

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  teamMembers: TeamMember[];
  onEditTask: (task: Task) => void;
  onAddTask: (columnId: ColumnId) => void;
}

const COLUMN_COLORS: Record<ColumnId, string> = {
  'backlog': '#94a3b8',
  'sprint-backlog': '#818cf8',
  'in-progress': '#fb923c',
  'code-review': '#a78bfa',
  'testing': '#34d399',
  'done': '#4ade80',
};

export const Column: React.FC<ColumnProps> = ({ id, title, tasks, teamMembers, onEditTask, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const taskIds = tasks.map(t => t.id);
  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);

  return (
    <div className={`column ${isOver ? 'column-over' : ''}`}>
      <div className="column-header" style={{ borderTopColor: COLUMN_COLORS[id] }}>
        <div className="column-title-row">
          <h3 className="column-title">{title}</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
        <div className="column-meta">
          <span className="column-points">{totalPoints} SP</span>
        </div>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={`column-body ${tasks.length === 0 ? 'empty' : ''}`}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              teamMembers={teamMembers}
              onEdit={onEditTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="empty-column-hint">Drop tasks here</div>
          )}
        </div>
      </SortableContext>

      <button className="add-task-btn" onClick={() => onAddTask(id)}>
        + Add Task
      </button>
    </div>
  );
};
