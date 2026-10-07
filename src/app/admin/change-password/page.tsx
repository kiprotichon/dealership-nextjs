"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const toast = {
  error: (message: string) => window.alert(message),
  success: (message: string) => window.alert(message),
};

export default function ChangePasswordPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      toast.error(
        "New password must be different from your current password"
      );
      return;
    }

    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">
        Change Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Password
          </label>

          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border rounded px-3 py-2"
          />

          <p className="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}