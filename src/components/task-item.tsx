"use client";

import type { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type React from 'react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDraggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnter?: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDragging,
  isDragOver,
}: TaskItemProps) {
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => isDraggable && onDragStart?.(e, task.id)}
      onDragOver={(e) => isDraggable && onDragOver?.(e, task.id)}
      onDragEnter={(e) => isDraggable && onDragEnter?.(e, task.id)}
      onDragLeave={(e) => isDraggable && onDragLeave?.(e)}
      onDrop={(e) => isDraggable && onDrop?.(e, task.id)}
      className={cn(
        "flex items-center space-x-3 p-3 bg-card border rounded-lg shadow-sm transition-all duration-300 ease-in-out",
        task.completed ? "opacity-60" : "hover:shadow-md",
        isDragging ? "opacity-50 ring-2 ring-accent scale-105 shadow-xl" : "",
        isDragOver && !isDragging ? "border-accent border-dashed ring-1 ring-accent" : "border-border",
      )}
      aria-label={`Task: ${task.text}, Status: ${task.completed ? 'Completed' : 'Pending'}`}
    >
      {isDraggable && (
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" aria-hidden="true" />
      )}
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-labelledby={`task-label-${task.id}`}
        className="transition-transform duration-200 ease-in-out hover:scale-110"
      />
      <label
        id={`task-label-${task.id}`}
        htmlFor={`task-${task.id}`}
        className={cn(
          "flex-1 text-sm font-medium cursor-pointer transition-colors duration-300",
          task.completed ? "line-through text-muted-foreground" : "text-foreground"
        )}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-destructive transition-colors duration-200 h-8 w-8"
        aria-label={`Delete task ${task.text}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
