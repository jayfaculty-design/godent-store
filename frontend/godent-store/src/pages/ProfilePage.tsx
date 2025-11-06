import { AuthContext } from "@/contexts/AuthContext";
import { FavoriteContext } from "@/contexts/FavoritesContext";
import { useContext } from "react";
import { BiChevronRight, BiHeart } from "react-icons/bi";
import { CiInboxIn } from "react-icons/ci";
import { PiGearFine } from "react-icons/pi";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { Link } from "react-router";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoriteContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-sm">
        {/* Welcome Section */}
        <div className="welcome bg-violet-400 text-white px-5 py-6 sm:py-8 md:px-8 lg:px-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            Welcome, {user.username}
          </h1>
          <p className="text-sm sm:text-base md:text-lg mt-1">{user.email}</p>
        </div>

        {/* Account Section */}
        <div className="account px-5 md:px-8 lg:px-10 py-6 sm:py-8">
          <div>
            <h1 className="font-semibold text-lg sm:text-xl md:text-2xl">
              MY ACCOUNT
            </h1>

            {/* Tabs */}
            <div className="tabs flex flex-col gap-3 sm:gap-4 mt-5 sm:mt-6">
              {[
                {
                  tabName: "Orders",
                  icon: <TfiShoppingCartFull className="text-lg sm:text-xl" />,
                  route: "/orders",
                },
                {
                  tabName: "Wishlist",
                  countBanner: true,
                  icon: <BiHeart className="text-lg sm:text-xl" />,
                  route: "/favorites",
                },
                {
                  tabName: "Inbox",
                  icon: <CiInboxIn className="text-lg sm:text-xl" />,
                  route: "/inbox",
                },
                {
                  tabName: "Account Management",
                  icon: <PiGearFine className="text-lg sm:text-xl" />,
                  route: "account-management",
                },
              ].map((tab, index) => (
                <Link
                  to={tab.route}
                  className="flex items-center justify-between py-3 px-4 sm:px-5 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  key={index}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-gray-700">{tab.icon}</div>

                    <p className="text-sm sm:text-base md:text-lg font-medium">
                      {tab.tabName}
                    </p>
                    {tab.countBanner && (
                      <span className="h-5 w-5 sm:h-6 sm:w-6 text-xs sm:text-sm flex items-center justify-center rounded-full text-white bg-violet-400">
                        {favorites.length}
                      </span>
                    )}
                  </div>
                  <BiChevronRight className="text-xl sm:text-2xl text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-5 md:px-8 lg:px-10 py-6 sm:py-8 border-t">
          <button
            onClick={logout}
            className="bg-violet-400 cursor-pointer hover:bg-violet-500 active:bg-violet-600 w-full sm:w-auto sm:min-w-[200px] py-2 sm:py-3 px-6 rounded-2xl font-bold text-white transition-colors text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
