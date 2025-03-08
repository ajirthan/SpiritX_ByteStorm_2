import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm bg-white rounded shadow-lg p-6">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Sign Up
        </h2>
        <SignupForm />
        <div className="mt-6 text-sm text-center">
          <span className="text-gray-700">Already have an account? </span>
          <Link href="/login">
            <button
              type="button"
              className="text-accent font-semibold hover:underline cursor-pointer"
            >
              Log In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
