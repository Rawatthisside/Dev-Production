import Article from "@/models/Article";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    verifyToken(token);
  } catch {
    redirect("/login");
  }

  await connectDB();

  const [totalArticles, totalUsers, activeUsersResult] = await Promise.all([
    Article.countDocuments(),
    User.countDocuments(),
    User.aggregate([
      {
        $match: {
          $expr: {
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
        },
      },
      { $count: "count" },
    ]),
  ]);

  const activeUsers = activeUsersResult[0]?.count ?? 0;

  const stats = [
    {
      label: "Total Articles",
      value: totalArticles,
      helper: "Published across the admin panel",
    },
    {
      label: "Total Users",
      value: totalUsers,
      helper: "All registered admin and editor accounts",
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
        <h1 className="text-3xl font-bold text-zinc-950">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
    </div>
  );
}

