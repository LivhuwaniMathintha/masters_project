import RequireAuth from "../RequireAuth";

export default function ConditionsPage() {
  return (
    <RequireAuth>
      <div className="p-8 text-xl">Conditions Page (Protected)</div>
    </RequireAuth>
  );
}
