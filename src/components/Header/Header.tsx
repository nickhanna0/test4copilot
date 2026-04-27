import React from 'react';
import type { FilterState, TeamMember, Priority, TaskType } from '../../types';
import './Header.css';

interface HeaderProps {
  teamMembers: TeamMember[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onNewTask: () => void;
}

const PRIORITY_OPTIONS: Priority[] = ['critical', 'high', 'medium', 'low'];
const TYPE_OPTIONS: TaskType[] = ['feature', 'bug', 'tech-debt', 'documentation'];

export const Header: React.FC<HeaderProps> = ({ teamMembers, filters, onFilterChange, onNewTask }) => {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo">🚀</div>
        <div>
          <h1 className="brand-title">AgileBoard</h1>
          <p className="brand-subtitle">Team Task Management</p>
        </div>
      </div>

      <div className="header-filters">
        <select
          className="filter-select"
          value={filters.assigneeId || ''}
          onChange={e => onFilterChange({ ...filters, assigneeId: e.target.value || null })}
        >
          <option value="">All Assignees</option>
          {teamMembers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.priority || ''}
          onChange={e => onFilterChange({ ...filters, priority: (e.target.value as Priority) || null })}
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.type || ''}
          onChange={e => onFilterChange({ ...filters, type: (e.target.value as TaskType) || null })}
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {activeFilterCount > 0 && (
          <button
            className="clear-filters-btn"
            onClick={() => onFilterChange({ assigneeId: null, priority: null, label: null, type: null })}
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      <button className="new-task-btn" onClick={onNewTask}>
        + New Task
      </button>
    </header>
  );
};
