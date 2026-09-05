import { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserInfoContext } from "../contexts/user.context";
import { api } from "../configs/axios.config";

const backendUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(UserInfoContext);
  const [toRoute, setToRoute] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toNavigateHandle = (routePath, tabName) => {
    if (tabName) setToRoute(tabName);
    navigate(routePath);
    setMobileMenuOpen(false);
  };

  const signoutHandler = async () => {
    try {
      const signoutStatus = await api.post(`${backendUrl}auth/signout`);
      if (signoutStatus.status === 200) {
        setUserInfo(null);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand / Logo (Button) */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => toNavigateHandle("/", "dashboard")}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm">
                S
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                StaffPortal
              </span>
            </button>

            {/* Desktop Navigation Links */}
            {userInfo && (
              <nav className="hidden items-center gap-1 md:flex">
                <button
                  type="button"
                  onClick={() => toNavigateHandle("/", "dashboard")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    toRoute === "dashboard"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => toNavigateHandle("/employees", "employee")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    toRoute === "employee"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  Employee List
                </button>
              </nav>
            )}
          </div>

          {/* Desktop Right Actions */}
          {!userInfo ? (
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                onClick={() => toNavigateHandle("/signin")}
              >
                Sign in
              </button>

              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                onClick={() => toNavigateHandle("/signup")}
              >
                Sign up
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-rose-50 hover:text-rose-600 transition-colors"
                onClick={signoutHandler}
              >
                Sign out
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              aria-label="Toggle Navigation"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 md:hidden">
            {userInfo ? (
              <>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => toNavigateHandle("/", "dashboard")}
                    className={`block w-full text-left rounded-lg px-3 py-2 text-base font-medium ${
                      toRoute === "dashboard"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => toNavigateHandle("/employees", "employee")}
                    className={`block w-full text-left rounded-lg px-3 py-2 text-base font-medium ${
                      toRoute === "employee"
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    Employee List
                  </button>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={signoutHandler}
                    className="w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => toNavigateHandle("/signin")}
                  className="w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => toNavigateHandle("/signup")}
                  className="w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <Outlet />
    </>
  );
};

export default Navbar;