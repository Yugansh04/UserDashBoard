"use client";

import { ProfileDisplay } from "@/components/profile-display";
import { StatisticsDisplay } from "@/components/statistics-display";
import { TaskList } from "@/components/task-list";
import { useTasks } from "@/hooks/use-tasks";

export default function HomePage() {
  const { completedTasks, incompleteTasks, isLoaded } = useTasks();

  const profileData = {
    name: "Alex Starr",
    email: "alex.starr@example.com",
    avatarUrl: "https://placehold.co/128x128.png?text=AS" 
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground p-2 sm:p-4 md:p-6 lg:p-8">
      <aside className="w-full md:w-1/3 lg:w-1/4 md:pr-4 lg:pr-6 mb-6 md:mb-0">
        <ProfileDisplay
          name={profileData.name}
          email={profileData.email}
          avatarUrl={profileData.avatarUrl}
        />
      </aside>

      <main className="flex-1 space-y-6">
        {isLoaded ? (
            <StatisticsDisplay
            completedCount={completedTasks.length}
            pendingCount={incompleteTasks.length}
            />
        ) : (
            <div className="grid gap-4 md:grid-cols-2 animate-pulse">
                <div className="h-28 bg-muted rounded-xl"></div>
                <div className="h-28 bg-muted rounded-xl"></div>
            </div>
        )}
        <TaskList />
      </main>
    </div>
  );
}
