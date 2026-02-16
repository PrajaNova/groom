"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type User = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
  avatar?: string;
};

type UsersAdminTableProps = {
  users: User[];
};

export default function UsersAdminTable({ users: initialUsers }: UsersAdminTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const handleDeleteUser = async (userId: string) => {
    // Prevent deleting own account
    if (userId === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }

      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      toast.success("Password reset successfully");
      setIsResetPasswordModalOpen(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !selectedRole) return;

    setLoading(true);
    try {
      // First, get all roles to find the role ID
      const rolesResponse = await fetch("/api/roles");
      if (!rolesResponse.ok) throw new Error("Failed to fetch roles");
      const roles = await rolesResponse.json();
      
      const role = roles.find((r: any) => r.name === selectedRole);
      if (!role) throw new Error("Role not found");

      // Assign the role
      const response = await fetch(`/api/users/${selectedUser.id}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: role.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to assign role");
      }

      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, roles: [...new Set([...u.roles, selectedRole])] }
          : u
      ));

      toast.success("Role assigned successfully");
      setIsRoleModalOpen(false);
      setSelectedRole("");
      setSelectedUser(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card table-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#2C3531]">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
          </div>
          <div className="text-sm text-gray-500">
            Total Users: <span className="font-semibold">{users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Joined</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B48B7F] flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs rounded-full bg-[#006442] text-white"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No roles</span>
                      )}
                    </div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsRoleModalOpen(true);
                        }}
                        className="icon-btn icon-btn-primary"
                        title="Manage Roles"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsResetPasswordModalOpen(true);
                        }}
                        className="icon-btn icon-btn-secondary"
                        title="Reset Password"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={loading || user.id === currentUser?.id}
                        className="icon-btn icon-btn-danger"
                        title={user.id === currentUser?.id ? "Cannot delete your own account" : "Delete User"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#2C3531] mb-4">
              Reset Password
            </h2>
            <p className="text-gray-600 mb-4">
              Reset password for <strong>{selectedUser.name}</strong>
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B48B7F] focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading || !newPassword}
                className="flex-1 bg-[#006442] text-white px-4 py-2 rounded-lg hover:bg-[#005235] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsResetPasswordModalOpen(false);
                  setNewPassword("");
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-[#2C3531] mb-4">
              Manage Roles
            </h2>
            <p className="text-gray-600 mb-4">
              Current roles for <strong>{selectedUser.name}</strong>:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedUser.roles.length > 0 ? (
                selectedUser.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 text-sm rounded-full bg-[#006442] text-white"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No roles assigned</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
                Add Role
              </label>
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B48B7F] focus:border-transparent"
              >
                <option value="">Select a role</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleChangeRole}
                disabled={loading || !selectedRole}
                className="flex-1 bg-[#006442] text-white px-4 py-2 rounded-lg hover:bg-[#005235] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Assigning..." : "Assign Role"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setSelectedRole("");
                  setSelectedUser(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
