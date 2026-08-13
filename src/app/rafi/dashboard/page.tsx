import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Rafi",
};

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/rafi");
  }

  const content = await getContent();

  return <Dashboard initial={content} />;
}
