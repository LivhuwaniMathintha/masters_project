import RequireAuth from "../RequireAuth";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <div className="p-8 text-xl">Dashboard Page (Admin Only, Protected)</div>
    </RequireAuth>
  );
}
