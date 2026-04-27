export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type TaskType = 'feature' | 'bug' | 'tech-debt' | 'documentation';
export type ColumnId = 'backlog' | 'sprint-backlog' | 'in-progress' | 'code-review' | 'testing' | 'done';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  storyPoints: number;
  assigneeId: string | null;
  labels: string[];
  type: TaskType;
  sprint: number;
  columnId: ColumnId;
  createdAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export interface Sprint {
  number: number;
  startDate: string;
  endDate: string;
  goal: string;
  velocity: number;
}

export interface FilterState {
  assigneeId: string | null;
  priority: Priority | null;
  label: string | null;
  type: TaskType | null;
}
