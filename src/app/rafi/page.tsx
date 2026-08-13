import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login — Rafi",
};

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/rafi/dashboard");
  }

  return (
    <main className="rafi-login">
      <div className="rafi-login__card">
        <h1 className="rafi-login__title">Rafi</h1>
        <p className="rafi-login__sub">Masuk ke dashboard</p>
        <LoginForm />
      </div>
    </main>
  );
}
