import Auth from "@/components/auth";

export default function Home() {
  return (
    <div className="flex w-full h-lvh overflow-hidden md:bg-zinc-950 dark:bg-slate-950">
      <div className="hidden w-1/2  md:flex md:flex-col md:justify-between py-5 px-5">
        <img src="logo.png" alt="logo" className="w-44" />
        <p className="text-white text-xl font-semibold dark:text-gray-500">
          Focus on what matters most. Time tracking made easy.
        </p>
      </div>
      <Auth />
    </div>
  );
}
