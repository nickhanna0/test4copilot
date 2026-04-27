import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TeamMember } from '../../types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  teamMembers: TeamMember[];
  onEdit: (task: Task) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

const TYPE_ICONS: Record<string, string> = {
  feature: '✨',
  bug: '🐛',
  'tech-debt': '🔧',
  documentation: '📄',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, teamMembers, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const assignee = teamMembers.find(m => m.id === task.assigneeId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card priority-${task.priority} ${isDragging ? 'dragging' : ''}`}
      onClick={() => onEdit(task)}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header">
        <span className="task-type-icon" title={task.type}>{TYPE_ICONS[task.type]}</span>
        <span className="priority-badge" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}>
          {task.priority}
        </span>
        <span className="story-points">{task.storyPoints} SP</span>
      </div>

      <h4 className="task-title">{task.title}</h4>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {task.labels.length > 0 && (
        <div className="task-labels">
          {task.labels.map(label => (
            <span key={label} className="label-tag">{label}</span>
          ))}
        </div>
      )}

      <div className="task-footer">
        <span className="sprint-badge">S{task.sprint}</span>
        {assignee ? (
          <div
            className="assignee-avatar"
            title={assignee.name}
            style={{ backgroundColor: assignee.color }}
          >
            {assignee.initials}
          </div>
        ) : (
          <div className="assignee-avatar unassigned" title="Unassigned">?</div>
        )}
      </div>
    </div>
  );
};
