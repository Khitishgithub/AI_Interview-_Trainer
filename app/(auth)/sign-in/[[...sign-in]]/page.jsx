import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
   
    <section className="h-screen">
  <div className="h-full">

    <div
      className="flex h-full flex-wrap items-center justify-center lg:justify-between">
      <div
        className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          className="w-full"
          alt="Sample image" />
      </div>

     
      <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
        <SignIn />
      </div>
    </div>
  </div>
</section>


    
  );
};