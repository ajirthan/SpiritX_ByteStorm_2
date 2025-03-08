import Link from "next/link";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Reset Password
        </h2>
        {/* Optional brief instruction */}
        <p className="text-sm text-gray-700 mb-6 text-center">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <ResetPasswordForm />

        <div className="mt-6 text-sm text-center">
          <p>
            <span className="text-gray-700">Remembered your password? </span>
            <Link href="/login">
              <button
                type="button"
                className="text-accent font-semibold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}