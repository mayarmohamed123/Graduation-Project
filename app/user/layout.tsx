import { ProtectedRoute } from "@/Components/auth";

export default function UserBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["RegularUser"]}>
      {children}
    </ProtectedRoute>
  );
}
