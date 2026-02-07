import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton } from "@clerk/nextjs";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 mb-8 rounded-md">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
          Welcome to <span className="text-black">FileDrive</span>
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Securely upload, store, and manage your files in one place. Built for
          speed and reliability.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <SignedOut>
            <SignInButton>
              <Button> Sign in</Button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-gray-900">Team Organizations</h3>
            <p className="mt-2 text-sm text-gray-600">
              Create organizations, collaborate with members, and share files in
              dedicated workspaces.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-gray-900">Easy Access</h3>
            <p className="mt-2 text-sm text-gray-600">
              Access your files anytime, anywhere with fast global delivery.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-gray-900">Real-time Sync</h3>
            <p className="mt-2 text-sm text-gray-600">
              Upload and manage files with instant updates across devices.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
