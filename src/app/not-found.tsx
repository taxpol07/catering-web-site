import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page Not Found</h1>
      <p className="mt-2 text-surface-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
