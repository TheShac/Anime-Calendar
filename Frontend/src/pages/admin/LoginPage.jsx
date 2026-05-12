import { useEffect } from "react";
import LoginForm from "../../features/auth/components/LoginForm";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Login — AniCalendar";
  }, []);
  return (
    <div
      className="
        min-h-screen
        bg-black
        flex
        items-center
        justify-center
        p-6
      "
    >
      <LoginForm />
    </div>
  );
}