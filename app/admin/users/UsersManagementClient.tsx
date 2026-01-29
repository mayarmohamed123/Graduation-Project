"use client";

import { AdminUser } from "@/types/admin";
import { UsersTable } from "@/components/features/admin/users/UsersTable";

interface UsersManagementClientProps {
  users: AdminUser[];
}

export default function UsersManagementClient({ users }: UsersManagementClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all regular users of the application</p>
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
