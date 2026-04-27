import React, { useState, useCallback } from 'react';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Task, TeamMember, ColumnId } from '../../types';
import { Column } from '../Column/Column';
import { TaskCard } from '../TaskCard/TaskCard';
import { COLUMN_ORDER, COLUMN_TITLES } from '../../data/initialData';
import './Board.css';

interface BoardProps {
  tasks: Task[];
  teamMembers: TeamMember[];
  onTasksChange: (tasks: Task[]) => void;
  onEditTask: (task: Task) => void;
  onAddTask: (columnId: ColumnId) => void;
}

export const Board: React.FC<BoardProps> = ({
  tasks,
  teamMembers,
  onTasksChange,
  onEditTask,
  onAddTask,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const getTasksForColumn = useCallback(
    (columnId: ColumnId) => tasks.filter(t => t.columnId === columnId),
    [tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if over a column directly
    if (COLUMN_ORDER.includes(overId as ColumnId)) {
      if (activeTask.columnId !== overId) {
        const updated = tasks.map(t =>
          t.id === activeId ? { ...t, columnId: overId as ColumnId } : t
        );
        onTasksChange(updated);
      }
      return;
    }

    // Check if over another task
    const overTask = tasks.find(t => t.id === overId);
    if (!overTask || activeTask.columnId === overTask.columnId) return;

    const updated = tasks.map(t =>
      t.id === activeId ? { ...t, columnId: overTask.columnId } : t
    );
    onTasksChange(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Reorder within column
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.columnId === overTask.columnId) {
      const colTasks = getTasksForColumn(activeTask.columnId);
      const oldIndex = colTasks.findIndex(t => t.id === activeId);
      const newIndex = colTasks.findIndex(t => t.id === overId);
      if (oldIndex !== newIndex) {
        const reordered = arrayMove(colTasks, oldIndex, newIndex);
        const otherTasks = tasks.filter(t => t.columnId !== activeTask.columnId);
        onTasksChange([...otherTasks, ...reordered]);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board">
        {COLUMN_ORDER.map(columnId => (
          <Column
            key={columnId}
            id={columnId}
            title={COLUMN_TITLES[columnId]}
            tasks={getTasksForColumn(columnId)}
            teamMembers={teamMembers}
            onEditTask={onEditTask}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            teamMembers={teamMembers}
            onEdit={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
