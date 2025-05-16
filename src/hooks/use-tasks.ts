"use client";

import { type Task } from '@/types';
import { produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'myDashTasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error);
      // Optionally, set to default tasks or clear storage if corrupted
      // localStorage.removeItem(LOCAL_STORAGE_KEY); 
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to local storage:", error);
      }
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((text: string) => {
    if (text.trim() === '') return;
    const newTask: Task = { id: crypto.randomUUID(), text, completed: false };
    setTasks(
      produce((draft) => {
        draft.push(newTask);
      })
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(
      produce((draft) => {
        const task = draft.find((t) => t.id === id);
        if (task) {
          task.completed = !task.completed;
        }
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(
      produce((draft) => {
        const index = draft.findIndex((t) => t.id === id);
        if (index !== -1) {
          draft.splice(index, 1);
        }
      })
    );
  }, []);

  const reorderTasks = useCallback((activeId: string, overId: string | null) => {
    setTasks(
      produce((draft) => {
        const activeTask = draft.find(t => t.id === activeId);
        if (!activeTask || activeTask.completed) return; // Only reorder incomplete tasks

        const activeTaskIndex = draft.findIndex(t => t.id === activeId);
        draft.splice(activeTaskIndex, 1); 

        if (overId === null) { 
          // Find last incomplete task index to insert after, or beginning if no incomplete tasks
          let lastIncompleteIndex = -1;
          for(let i = draft.length - 1; i >= 0; i--) {
            if(!draft[i].completed) {
              lastIncompleteIndex = i;
              break;
            }
          }
          draft.splice(lastIncompleteIndex + 1, 0, activeTask);
        } else {
          const overTask = draft.find(t => t.id === overId);
          if (overTask && !overTask.completed) { // Ensure overId is also an incomplete task
            const overTaskIndex = draft.findIndex(t => t.id === overId);
            draft.splice(overTaskIndex, 0, activeTask); 
          } else {
             // Fallback if overId is not incomplete or not found: add to end of incomplete tasks
            let lastIncompleteIndex = -1;
            for(let i = draft.length - 1; i >= 0; i--) {
              if(!draft[i].completed) {
                lastIncompleteIndex = i;
                break;
              }
            }
            draft.splice(lastIncompleteIndex + 1, 0, activeTask);
          }
        }
      })
    );
  }, []);
  

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);

  return {
    tasks,
    completedTasks,
    incompleteTasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    isLoaded,
  };
}
