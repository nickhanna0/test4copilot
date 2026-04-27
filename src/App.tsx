import { useState, useCallback, useMemo } from 'react';
import type { Task, FilterState, ColumnId } from './types';
import { initialTasks, teamMembers, currentSprint } from './data/initialData';
import { Board } from './components/Board/Board';
import { Header } from './components/Header/Header';
import { SprintPanel } from './components/SprintPanel/SprintPanel';
import { TaskModal } from './components/TaskModal/TaskModal';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<FilterState>({
    assigneeId: null,
    priority: null,
    label: null,
    type: null,
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultColumnId, setDefaultColumnId] = useState<ColumnId>('backlog');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.type && task.type !== filters.type) return false;
      if (filters.label && !task.labels.includes(filters.label)) return false;
      return true;
    });
  }, [tasks, filters]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleAddTask = useCallback((columnId: ColumnId) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  }, []);

  const handleNewTask = useCallback(() => {
    setEditingTask(null);
    setDefaultColumnId('backlog');
    setIsModalOpen(true);
  }, []);

  const handleSaveTask = useCallback((task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) {
        return prev.map(t => (t.id === task.id ? task : t));
      }
      return [...prev, task];
    });
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleTasksChange = useCallback((newTasks: Task[]) => {
    setTasks(prev => {
      const filteredIds = new Set(filteredTasks.map(t => t.id));
      const untouched = prev.filter(t => !filteredIds.has(t.id));
      return [...untouched, ...newTasks];
    });
  }, [filteredTasks]);

  return (
    <div className="app">
      <Header
        teamMembers={teamMembers}
        filters={filters}
        onFilterChange={setFilters}
        onNewTask={handleNewTask}
      />
      <div className="app-content">
        <div className="sprint-panel-wrapper">
          <SprintPanel sprint={currentSprint} tasks={tasks} />
        </div>
        <Board
          tasks={filteredTasks}
          teamMembers={teamMembers}
          onTasksChange={handleTasksChange}
          onEditTask={handleEditTask}
          onAddTask={handleAddTask}
        />
      </div>
      <TaskModal
        task={editingTask}
        teamMembers={teamMembers}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
}

export default App;
