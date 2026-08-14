import {
  CiLocationOn,
  CiPhone,
} from "react-icons/ci";

import type {
  SiteSettings,
} from "@/types/site-settings";

type HeaderProps = {
  settings: SiteSettings | null;
};

export const Header = ({
  settings,
}: HeaderProps) => {
  const phone =
    settings?.phone?.trim() || "";

  const address =
    settings?.address?.trim() || "";

  const hasContactInfo =
    Boolean(phone) ||
    Boolean(address);

  return (
    <header className="w-full bg-header px-4 py-2 text-white sm:px-6 md:px-12 lg:px-16">
      <div
        className={`
          mx-auto flex max-w-[1600px]
          items-center
          ${
            hasContactInfo
              ? "justify-center md:justify-between"
              : "justify-center"
          }
        `}
      >
        <div className="flex items-center gap-2">
          <CiLocationOn className="shrink-0" />

          <p className="text-center text-[10px] leading-4 sm:text-xs md:text-left">
            Saros&apos;un kıyısında,
            doğanın içinde huzurlu
            bir kaçış.
          </p>
        </div>

        {hasContactInfo && (
          <div className="hidden items-center gap-6 lg:flex">
            {address && (
              <div className="flex items-center gap-2">
                <CiLocationOn />

                <span className="text-xs">
                  {address}
                </span>
              </div>
            )}

            {phone && (
              <a
                href={`tel:${phone.replace(
                  /\s/g,
                  "",
                )}`}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <CiPhone />

                <span className="text-xs">
                  {phone}
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
};