import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "STUDENT") {
    redirect("/dashboard/student");
  } else if (role === "FACULTY_MENTOR") {
    redirect("/dashboard/faculty/internships");
  } else if (role === "INTERNSHIP_COORDINATOR") {
    redirect("/dashboard/coordinator/internships");
  } else if (role === "RECRUITER") {
    redirect("/dashboard/recruiter");
  } else if (role === "TPO") {
    redirect("/dashboard/tpo");
  } else if (role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/login");
  }
}
