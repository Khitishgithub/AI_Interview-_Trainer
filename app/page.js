import { FingerprintIcon, LockIcon } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center h-screen w-full mx-auto bg-indigo-900">
      <div className="max-w-lg p-4 rounded-lg flex flex-col justify-center items-center">
        {/* <FingerprintIcon className="text-indigo-500 w-24 h-24" /> */}
        <div className="text-center max-w-screen-sm pt-4 pb-10">
          {/* <h1 className="text-white font-bold text-2xl">Next Protect</h1> */}
          
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold space-x-1 text-indigo-700 shadow-sm hover:bg-white/90"
          >
            <LockIcon className="w-4 h-4" />
            <span>Go to Sign In Page</span>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
