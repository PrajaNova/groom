"use client";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export default function RolesSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/roles"),
      ]);

      if (!usersRes.ok || !rolesRes.ok) throw new Error("Failed");

      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();

      setUsers(usersData);
      setRolesList(rolesData);
    } catch (e) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRole = async (
    userId: string,
    roleId: string,
    hasRole: boolean,
  ) => {
    try {
      const endpoint = hasRole ? "/api/roles/remove" : "/api/roles/add";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleIds: [roleId] }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      toast.success(`Role ${hasRole ? "removed" : "added"}`);
      fetchData(); // Refresh to show latest state
    } catch (e) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Roles Management</h2>
      <p className="text-sm text-gray-500">
        Manage user permissions and access levels.
      </p>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {users.map((user) => {
              const isExpanded = expandedUser === user.id;
              return (
                <div
                  key={user.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B48B7F] to-[#2C3531] flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {user.roles.map((r) => (
                          <span
                            key={r.id}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200"
                          >
                            {r.name}
                          </span>
                        ))}
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 pl-[4.5rem]">
                      <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Assign Roles
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {rolesList.map((role) => {
                            const hasRole = user.roles.some(
                              (r) => r.id === role.id,
                            );
                            return (
                              <label
                                key={role.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-all ${
                                  hasRole
                                    ? "bg-[#2C3531] text-white border-[#2C3531]"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={hasRole}
                                  onChange={() =>
                                    toggleRole(user.id, role.id, hasRole)
                                  }
                                  className="hidden"
                                />
                                <Shield
                                  size={14}
                                  className={
                                    hasRole ? "text-white" : "text-gray-400"
                                  }
                                />
                                <span className="text-sm font-medium">
                                  {role.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
