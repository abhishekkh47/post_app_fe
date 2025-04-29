import React from "react";
import { NavLink } from "react-router";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../image.png";
import { Loader2 } from "lucide-react";
import { SearchBar, Notification } from "./";
import { useNavBar } from "../../hooks";
import { ProfilePicture } from "../profile";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const NavBar: React.FC = () => {
  const {
    user,
    navigation,
    isLoggingOut,
    profileMenuOpen,
    profileMenuRef,
    handleLogOutClick,
    handleProfileClick,
    handleDashboardClick,
    toggleProfileDropdown,
  } = useNavBar();

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 w-full z-50">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-10 lg:h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-1 text-gray-400">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon aria-hidden="true" className="block size-6" />
                  ) : (
                    <Bars3Icon aria-hidden="true" className="block size-6" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
                <div className="flex shrink-0 items-center">
                  <img
                    alt="Postal"
                    src={logo}
                    loading="lazy"
                    className="h-8 w-auto"
                    onClick={handleDashboardClick}
                  />
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <SearchBar />
                <Notification />
                {/* Profile dropdown */}
                <div className="relative ml-3" ref={profileMenuRef}>
                  <div className="min-w-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProfileDropdown(!profileMenuOpen);
                      }}
                      className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none hover:text-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <ProfilePicture
                        profile_pic={user?.profile_pic}
                        firstName={user?.firstName || ""}
                        size={8}
                        text={`lg`}
                      />
                    </button>
                  </div>

                  {profileMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                      <div
                        onClick={() => {
                          handleProfileClick();
                          toggleProfileDropdown(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Your Profile
                      </div>
                      <div
                        onClick={(e) => {
                          handleLogOutClick(e);
                          toggleProfileDropdown(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex items-center">
                          <span>Sign out</span>
                          {isLoggingOut && (
                            <Loader2 className="ml-2 animate-spin" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DisclosurePanel className="lg:hidden fixed left-0 top-10 w-36 h-[calc(100vh-2.5rem)] bg-gray-800 transform transition-transform duration-1000 ease-in-out z-40 overflow-y-auto data-closed:-translate-x-full data-open:translate-x-0">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  onClick={(e) => {
                    if (item?.onClick) {
                      e.preventDefault();
                      item.onClick();
                      close();
                    }
                  }}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default NavBar;
