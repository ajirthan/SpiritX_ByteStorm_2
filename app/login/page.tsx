import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm bg-white rounded shadow-lg p-6">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Login
        </h2>
        <LoginForm />
        <div className="mt-6 text-sm text-center space-y-3">
          <div>
            <span className="text-gray-700">Forgot your password? </span>
            <Link href="/reset-password">
              <button
                type="button"
                className="text-accent font-semibold hover:underline cursor-pointer"
              >
                Reset Password
              </button>
            </Link>
          </div>
          <div>
            <span className="text-gray-700">Don’t have an account? </span>
            <Link href="/signup">
              <button
                type="button"
                className="text-accent font-semibold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
