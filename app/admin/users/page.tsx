"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminUser } from "@/types/admin";
import { adminService } from "@/Services/admin/adminService";
import { UsersTable } from "@/Components/features/admin/users/UsersTable";
import LoadingSpinner from "@/Components/common/LoadingSpinner";
import { Users, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllRegularUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all regular users of the application</p>
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-500 animate-pulse">Loading users list...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Users</h3>
          <p className="text-gray-500 max-w-md mb-6">{error}</p>
          <button
            onClick={() => fetchUsers()}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  );
}
