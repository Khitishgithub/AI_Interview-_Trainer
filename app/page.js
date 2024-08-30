import Link from "next/link";

export default function Home() {
  return (
    <section class="h-screen">
      <div class="h-full">
        <div class="flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
              class="w-full"
              alt="Sample image"
            />
          </div>

          <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
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
    </section>
  );
}
