import GrantAccessForm from "./grant-access-form";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type UserRow = {
  _id: string;
  name?: string;
  email: string;
  role: "admin" | "editor";
  createdAt: string | Date;
  lastLogin: string | Date | null;
  status: "Active" | "Inactive" | "No login yet";
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(value: string | Date | null | undefined) {
  if (!value) {
    return "Never";
  }

  return dateFormatter.format(new Date(value));
}

function roleBadgeClass(role: UserRow["role"]) {
  return role === "admin"
    ? "bg-black text-white"
    : "bg-zinc-100 text-zinc-800";
}

function statusBadgeClass(status: UserRow["status"]) {
  if (status === "Active") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (status === "Inactive") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }

  return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200";
}

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let authUser;

  try {
    authUser = verifyToken(token);
  } catch {
    redirect("/login");
  }

  await connectDB();

  const users = (await User.aggregate([
    {
      $addFields: {
        roleOrder: {
          $cond: [{ $eq: ["$role", "admin"] }, 0, 1],
        },
        status: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$lastLogin", null] },
                then: "No login yet",
              },
              {
                case: {
                  $gte: [
                    "$lastLogin",
                    {
                      $dateSubtract: {
                        startDate: "$$NOW",
                        unit: "day",
                        amount: 7,
                      },
                    },
                  ],
                },
                then: "Active",
              },
            ],
            default: "Inactive",
          },
        },
      },
    },
    {
      $sort: {
        roleOrder: 1,
        createdAt: -1,
      },
    },
    {
      $project: {
        _id: { $toString: "$_id" },
        name: 1,
        email: 1,
        role: 1,
        createdAt: 1,
        lastLogin: 1,
        status: 1,
      },
    },
  ])) as UserRow[];

  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.role === "admin").length;
  const activeUsers = users.filter((user) => user.status === "Active").length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      helper: "Users with access to this admin panel",
    },
    {
      label: "Admin Roles",
      value: adminUsers,
      helper: "Users with full control permissions",
    },
    {
      label: "Active Users",
      value: activeUsers,
      helper: "Logged in during the last 7 days",
    },
  ];

return (
  <div className="space-y-8 text-zinc-950">
    <div>
      <h1 className="text-3xl font-bold text-zinc-950">Users</h1>
      <p className="mt-4 text-md text-zinc-600">
        See who can access the admin panel, what role they have with logs
      </p>
    </div>

    {/* Stats centered */}
    <div className="mx-80 grid max-w-7xl gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <section
          key={stat.label}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            {stat.label}
          </p>
          <p className="mt-4 text-4xl font-bold text-zinc-950">
            {stat.value}
          </p>
          <p className="mt-3 text-sm text-zinc-700">{stat.helper}</p>
        </section>
      ))}
    </div>

    {/* Form centered */}
    <div className="mx-auto max-w-3xl">
      {authUser.role === "admin" ? (
        <GrantAccessForm />
      ) : (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-950">
            Grant Access
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Only admin users can create new accounts from this panel.
          </p>
        </section>
      )}
    </div>

    {/* Table centered */}
    <section className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-zinc-950">
          Access Table
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          All users who currently have access to this admin panel.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="px-6 py-10 text-sm text-zinc-600">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Access Since
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Last Login
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <tr key={user._id} className="align-top">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-950">
                      {user.name?.trim() || "Unnamed User"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-700">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${roleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-700">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-sm text-zinc-700">
                    {formatDate(user.lastLogin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  </div>
);
}
