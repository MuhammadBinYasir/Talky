import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-sky-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Check your email</h1>
        <p className="text-neutral-500 mb-8 text-sm">
          We've sent a verification link to your email address. Please click the link to confirm your account and start chatting.
        </p>
        <Link 
          href="/login" 
          className="block w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition-colors mb-4"
        >
          Back to Login
        </Link>
        <p className="text-xs text-neutral-400">
          Didn't receive it? Check your spam folder or contact support.
        </p>
      </div>
    </div>
  );
}
