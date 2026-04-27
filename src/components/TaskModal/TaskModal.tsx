import React, { useState, useEffect } from 'react';
import type { Task, TeamMember, Priority, TaskType, ColumnId } from '../../types';
import './TaskModal.css';

interface TaskModalProps {
  task: Task | null;
  teamMembers: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  defaultColumnId?: ColumnId;
}

const STORY_POINT_OPTIONS = [1, 2, 3, 5, 8, 13];
const PRIORITY_OPTIONS: Priority[] = ['critical', 'high', 'medium', 'low'];
const TYPE_OPTIONS: TaskType[] = ['feature', 'bug', 'tech-debt', 'documentation'];
const COLUMN_OPTIONS: ColumnId[] = ['backlog', 'sprint-backlog', 'in-progress', 'code-review', 'testing', 'done'];

const COLUMN_LABELS: Record<ColumnId, string> = {
  'backlog': 'Backlog',
  'sprint-backlog': 'Sprint Backlog',
  'in-progress': 'In Progress',
  'code-review': 'Code Review',
  'testing': 'Testing',
  'done': 'Done',
};

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  teamMembers,
  isOpen,
  onClose,
  onSave,
  onDelete,
  defaultColumnId = 'backlog',
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [labelInput, setLabelInput] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
        id: generateId(),
        title: '',
        description: '',
        priority: 'medium',
        storyPoints: 3,
        assigneeId: null,
        labels: [],
        type: 'feature',
        sprint: 12,
        columnId: defaultColumnId,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    setLabelInput('');
  }, [task, isOpen, defaultColumnId]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Task, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLabel = () => {
    const trimmed = labelInput.trim().toLowerCase();
    if (trimmed && !formData.labels?.includes(trimmed)) {
      handleChange('labels', [...(formData.labels || []), trimmed]);
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    handleChange('labels', formData.labels?.filter(l => l !== label) || []);
  };

  const handleSave = () => {
    if (!formData.title?.trim()) return;
    onSave(formData as Task);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Task title..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe the task..."
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type || 'feature'}
                onChange={e => handleChange('type', e.target.value)}
                className="form-select"
              >
                {TYPE_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority || 'medium'}
                onChange={e => handleChange('priority', e.target.value)}
                className="form-select"
              >
                {PRIORITY_OPTIONS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Story Points</label>
              <select
                value={formData.storyPoints || 3}
                onChange={e => handleChange('storyPoints', Number(e.target.value))}
                className="form-select"
              >
                {STORY_POINT_OPTIONS.map(sp => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assignee</label>
              <select
                value={formData.assigneeId || ''}
                onChange={e => handleChange('assigneeId', e.target.value || null)}
                className="form-select"
              >
                <option value="">Unassigned</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Column</label>
              <select
                value={formData.columnId || 'backlog'}
                onChange={e => handleChange('columnId', e.target.value)}
                className="form-select"
              >
                {COLUMN_OPTIONS.map(c => (
                  <option key={c} value={c}>{COLUMN_LABELS[c]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sprint</label>
              <input
                type="number"
                value={formData.sprint || 12}
                onChange={e => handleChange('sprint', Number(e.target.value))}
                className="form-input"
                min={1}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Labels</label>
            <div className="label-input-row">
              <input
                type="text"
                value={labelInput}
                onChange={e => setLabelInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddLabel()}
                placeholder="Add label..."
                className="form-input"
              />
              <button className="add-label-btn" onClick={handleAddLabel}>Add</button>
            </div>
            <div className="labels-list">
              {formData.labels?.map(label => (
                <span key={label} className="label-chip">
                  {label}
                  <button onClick={() => handleRemoveLabel(label)}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {task && (
            <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          )}
          <div className="modal-footer-right">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!formData.title?.trim()}
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
