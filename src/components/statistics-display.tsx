import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ListTodo } from "lucide-react";

interface StatisticsDisplayProps {
  completedCount: number;
  pendingCount: number;
}

export function StatisticsDisplay({ completedCount, pendingCount }: StatisticsDisplayProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
          <ListTodo className="h-5 w-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">Tasks waiting to be completed</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{completedCount}</div>
          <p className="text-xs text-muted-foreground">Tasks you've conquered</p>
        </CardContent>
      </Card>
    </div>
  );
}
