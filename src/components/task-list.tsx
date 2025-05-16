"use client";

import type React from 'react';
import { useState, useRef } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { TaskItem } from '@/components/task-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ListChecks, CheckSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TaskList() {
  const {
    incompleteTasks,
    completedTasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    isLoaded,
  } = useTasks();
  const [newTaskText, setNewTaskText] = useState('');
  
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const dragOverItem = useRef<string | null>(null);


  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    const task = incompleteTasks.find(t => t.id === taskId);
    if (!task || task.completed) { // Only allow dragging incomplete tasks
        event.preventDefault();
        return;
    }
    setDraggingTaskId(taskId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, taskId: string) => {
    event.preventDefault(); 
    const task = incompleteTasks.find(t => t.id === taskId);
    if (task && !task.completed && draggingTaskId && draggingTaskId !== taskId) { // Ensure target is also incomplete and not the dragged item
        if (taskId !== dragOverItem.current) {
            dragOverItem.current = taskId;
            setDragOverTaskId(taskId); 
        }
    } else if (!task || task.completed) { // Don't allow dragging over completed tasks
        setDragOverTaskId(null);
        dragOverItem.current = null;
    }
  };
  
  const handleDragLeaveItem = () => {
    dragOverItem.current = null;
    setDragOverTaskId(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetTaskId: string | null = null) => {
    event.preventDefault();
    const activeId = draggingTaskId || event.dataTransfer.getData('text/plain');

    if (!activeId) {
        setDraggingTaskId(null);
        setDragOverTaskId(null);
        dragOverItem.current = null;
        return;
    }

    const activeTask = incompleteTasks.find(t => t.id === activeId);
    if(!activeTask || activeTask.completed) { // Ensure active task is incomplete
      setDraggingTaskId(null);
      setDragOverTaskId(null);
      dragOverItem.current = null;
      return;
    }
    
    if (targetTaskId) {
        const targetTask = incompleteTasks.find(t => t.id === targetTaskId);
        if (!targetTask || targetTask.completed || activeId === targetTaskId) { // Ensure target is incomplete and not self
            setDraggingTaskId(null);
            setDragOverTaskId(null);
            dragOverItem.current = null;
            return;
        }
    }
    
    reorderTasks(activeId, targetTaskId);
    
    setDraggingTaskId(null);
    setDragOverTaskId(null);
    dragOverItem.current = null;
  };
  
  const handleDropOnIncompleteListEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Check if the drop target is the specific container for incomplete tasks.
    // This requires the container to have an onDrop handler.
    // For simplicity, if dragOverItem.current is null (not over another item), 
    // and we are dropping, it means end of list.
    if (!dragOverItem.current) {
        const activeId = draggingTaskId || event.dataTransfer.getData('text/plain');
        if (activeId) {
            const activeTask = incompleteTasks.find(t => t.id === activeId);
            if(activeTask && !activeTask.completed) {
                reorderTasks(activeId, null);
            }
        }
    }
    setDraggingTaskId(null);
    setDragOverTaskId(null);
    dragOverItem.current = null;
  };


  if (!isLoaded) {
    return (
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-semibold">
            <ListChecks className="mr-3 h-7 w-7 text-primary" />
            Loading Tasks...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-muted rounded-md"></div>
            <div className="h-10 bg-muted rounded-md"></div>
            <div className="h-10 bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-2xl font-semibold">
          <ListChecks className="mr-3 h-7 w-7 text-primary" />
          My Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleAddTask} className="flex gap-2 p-4 border-b">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow"
            aria-label="New task description"
          />
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Add task">
            <Plus className="h-5 w-5 mr-1" /> Add
          </Button>
        </form>

        <ScrollArea className="h-[calc(100vh-450px)] md:h-[calc(100vh-400px)] lg:h-[350px]">
          <div className="p-4 space-y-3" >
            {incompleteTasks.length === 0 && completedTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No tasks yet. Add one above!</p>
            )}

            {incompleteTasks.length > 0 && (
              <div 
                className="space-y-3"
                onDragOver={(e) => { e.preventDefault(); if (!dragOverItem.current) setDragOverTaskId(null);}} // Allows dropping at end
                onDrop={handleDropOnIncompleteListEnd} // Handles drop at end
              >
                <h3 className="text-lg font-medium text-muted-foreground ml-1">Pending</h3>
                {incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    isDraggable={true}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnter={(e, id) => { dragOverItem.current = id; setDragOverTaskId(id);}}
                    onDragLeave={handleDragLeaveItem}
                    onDrop={handleDrop}
                    isDragging={draggingTaskId === task.id}
                    isDragOver={dragOverTaskId === task.id && draggingTaskId !== task.id}
                  />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && incompleteTasks.length > 0 && (
              <Separator className="my-6" />
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-muted-foreground ml-1 flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5 text-green-500" />
                  Completed
                </h3>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    isDraggable={false} 
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
