import { AppointmentSheet } from "@/modules/appointment/appointment";
import Navbar from "@/modules/home/_components/navbar/Navbar";

export default function NewAppointmentPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Navbar />
      <AppointmentSheet isModal={false} />
    </main>
  );
}
