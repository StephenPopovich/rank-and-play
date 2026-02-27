import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-purple-400">Account Created 🎉</h1>

        <p className="text-gray-300">You made your account. Nice job.</p>

        <p className="text-gray-400 text-sm">Now click the button to sign in.</p>

        <Link
          href="/auth/signin"
          className="inline-block rounded-md bg-purple-600 px-6 py-2 font-semibold hover:bg-purple-500"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}