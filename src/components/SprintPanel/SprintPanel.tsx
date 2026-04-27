import React from 'react';
import type { Sprint, Task } from '../../types';
import './SprintPanel.css';

interface SprintPanelProps {
  sprint: Sprint;
  tasks: Task[];
}

export const SprintPanel: React.FC<SprintPanelProps> = ({ sprint, tasks }) => {
  const sprintTasks = tasks.filter(t => t.sprint === sprint.number);
  const doneTasks = sprintTasks.filter(t => t.columnId === 'done');
  const totalPoints = sprintTasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const burnedPoints = doneTasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const progress = totalPoints > 0 ? (burnedPoints / totalPoints) * 100 : 0;

  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const today = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, totalDays - elapsed);

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="sprint-panel">
      <div className="sprint-info">
        <div className="sprint-badge-large">Sprint {sprint.number}</div>
        <div className="sprint-dates">
          {formatDate(startDate)} – {formatDate(endDate)}
          <span className="days-left">{daysLeft}d left</span>
        </div>
      </div>

      <div className="sprint-goal">
        <span className="sprint-goal-label">Goal:</span>
        <span className="sprint-goal-text">{sprint.goal}</span>
      </div>

      <div className="sprint-stats">
        <div className="stat">
          <div className="stat-value">{doneTasks.length}/{sprintTasks.length}</div>
          <div className="stat-label">Tasks</div>
        </div>
        <div className="stat">
          <div className="stat-value">{burnedPoints}/{totalPoints}</div>
          <div className="stat-label">Points</div>
        </div>
        <div className="stat">
          <div className="stat-value">{sprint.velocity}</div>
          <div className="stat-label">Velocity</div>
        </div>
        <div className="stat">
          <div className="stat-value">{Math.round(progress)}%</div>
          <div className="stat-label">Complete</div>
        </div>
      </div>

      <div className="sprint-progress">
        <div
          className="sprint-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
