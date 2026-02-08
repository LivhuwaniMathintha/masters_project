import RequireAuth from "../RequireAuth";

export default function PaymentsPage() {
  return (
    <RequireAuth>
      <div className="p-8 text-xl">Payments Page (Protected)</div>
    </RequireAuth>
  );
}
