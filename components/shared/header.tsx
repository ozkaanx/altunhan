import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";

export const Header = () => {
  return (
    <>
      <header className="w-full bg-header text-white p-2 px-16">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <CiLocationOn />
            <h5 className="text-xs">
              Saros'un Kıyısında , doğanın içinde huzurlu bir kaçış.
            </h5>
          </div>

          <div className="flex gap-8 items-end">
            <div className="flex gap-2 items-center">
              <CiLocationOn />
              <h6 className="text-xs">Adilhan Köyü, Keşan / Edirne</h6>
            </div>
            <div className="flex gap-2 items-center">
              <CiPhone />
              <h6 className="text-xs">0505 123 45 67</h6>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
