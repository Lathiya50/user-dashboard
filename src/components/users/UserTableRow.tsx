import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User2 } from "lucide-react";
import { User } from "@/types/user";

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="font-medium">{user.id}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            {user.image ? (
              <AvatarImage
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : (
              <AvatarFallback className="bg-primary/10">
                <User2 className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-sm text-gray-500">@{user.username}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{user.email}</span>
          </div>
          {user.phone && (
            <span className="text-sm text-gray-500">{user.phone}</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-2">
          {user.gender && (
            <Badge variant="outline" className="capitalize">
              {user.gender}
            </Badge>
          )}
          {user.age && <Badge variant="outline">{user.age} years</Badge>}
          {user.birthDate && (
            <Badge variant="outline">
              {new Date(user.birthDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
