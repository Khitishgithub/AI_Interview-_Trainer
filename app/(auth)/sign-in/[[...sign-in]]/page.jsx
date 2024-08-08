import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
   
    <section class="h-screen">
  <div class="h-full">

    <div
      class="flex h-full flex-wrap items-center justify-center lg:justify-between">
      <div
        class="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
        <img
          src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
          class="w-full"
          alt="Sample image" />
      </div>

     
      <div class="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
        <SignIn />
      </div>
    </div>
  </div>
</section>












   
  



    
  );
};