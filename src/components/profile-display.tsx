import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface ProfileDisplayProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function ProfileDisplay({ name, email, avatarUrl = "https://placehold.co/128x128.png" }: ProfileDisplayProps) {
  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="items-center pt-6">
        <Avatar className="h-28 w-28 mb-4 border-2 border-primary">
          <AvatarImage src={avatarUrl} alt={name} data-ai-hint="profile avatar" />
          <AvatarFallback>
            <User className="h-14 w-14 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-3xl font-semibold text-foreground">{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <p className="text-md text-muted-foreground">{email}</p>
      </CardContent>
    </Card>
  );
}
