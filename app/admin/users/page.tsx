import { adminService } from "@/Services/admin/adminService";
import UsersManagementClient from "./UsersManagementClient";
import { AdminUser } from "@/types/admin";

export default async function UsersManagementPage() {
  let users: AdminUser[] = [];
  try {
    users = await adminService.getAllRegularUsers();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return <UsersManagementClient users={users} />;
}
