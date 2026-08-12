import {
  CiLocationOn,
  CiPhone,
} from "react-icons/ci";

export const Header = () => {
  return (
    <header className="w-full bg-header px-4 py-2 text-white sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center md:justify-between">
        <div className="flex items-center gap-2">
          <CiLocationOn className="shrink-0" />

          <p className="text-center text-[10px] leading-4 sm:text-xs md:text-left">
            Saros&apos;un kıyısında, doğanın içinde huzurlu bir kaçış.
          </p>
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="flex items-center gap-2">
            <CiLocationOn />

            <span className="text-xs">
              Adilhan Köyü, Keşan / Edirne
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CiPhone />

            <span className="text-xs">
              0505 123 45 67
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};