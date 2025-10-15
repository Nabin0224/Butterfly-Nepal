import styleme from "../../assets/logo/styleme.jpg";
import butterfly from "../../assets/logo/favicon.png";
import {
  CircleUserRound,
  House,
  LogOutIcon,
  ShoppingCart,
  User,
  Menu,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "../../config/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { logOut } from "../../../store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "../../../store/shop/cart-slice";
import { selectNormalizedCartItems } from "../../../store/shop/cart-slice";
import { Label } from "../ui/label";
import AuthPopup from "./login-card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Store_Name } from "../../utils/constants/storeConstants";

// --- Menu Items Component ---
function MenuItems({ setOpenMobileCartSheet }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isActive = (path, category = "") => {
    const currentPath = location.pathname;
    const currentCategory = searchParams.get("category");
    if (category) return currentPath === path && currentCategory === category;
    return currentPath === path;
  };

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search"
        ? { category: [menuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter) {
      setSearchParams(new URLSearchParams(`?category=${menuItem.id}`));
    } else {
      navigate(menuItem.path);
    }
    setOpenMobileCartSheet(false);
  };

  return (
    <nav className="flex flex-col items-center gap-10 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className={`text-sm font-medium cursor-pointer transition-all duration-300 relative ${
            isActive("/listing", menuItem.id)
              ? "font-[550] text-md underline decoration-black-100"
              : "hover:underline"
          }`}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// --- Header Right Content ---
function HeaderRightContent({ openMobileCartSheet, setOpenMobileCartSheet = () => {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectNormalizedCartItems);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const handleLogOut = () => {
    setTimeout(() => {
      dispatch(logOut());
      setOpenCartSheet(false);
      setOpenMobileCartSheet(false);
      navigate("/");
    }, 100);
  };

  return (
    <div className="flex lg:flex-row lg:item-center flex-col gap-6">
      <Sheet
        open={openCartSheet}
        onOpenChange={() => {
          setOpenCartSheet(false);
          setOpenMobileCartSheet(false);
        }}
      >
        {!user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Login</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] md:max-w-md">
              <AuthPopup isLogin={isLogin} setIsLogin={setIsLogin} />
            </DialogContent>
          </Dialog>
        )}

        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="Ghost"
          size="icon"
          className="relative"
        >
          <ShoppingCart strokeWidth={1.2} className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute top-[-2px] right-[4px] font-bold text-xs">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">User cart</span>
        </Button>

        <UserCartWrapper
          cartItems={cartItems}
          setOpenCartSheet={setOpenCartSheet}
          setOpenMobileCartSheet={setOpenMobileCartSheet}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : user?.userName?.[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          {user && <DropdownMenuLabel className="mb-1">Logged in as {user.userName}</DropdownMenuLabel>}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate("/account");
              setOpenMobileCartSheet(false);
            }}
          >
            <User className="mr-2 h-4 w-4" /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {handleLogOut();
             setOpenMobileCartSheet(false)}}>
            <LogOutIcon className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// --- Shopping Header ---
const ShoppingHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectNormalizedCartItems);
  const [openMobileCartSheet, setOpenMobileCartSheet] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  return (
    <header className="top-0 z-50 w-full border-b bg-white backdrop-blur-md shadow-md transition-all duration-300">
      <div className="flex h-12 md:h-16 items-center justify-between px-2 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={butterfly} className="h-10 w-10 rounded-sm" />
          <span className="font-bold">{Store_Name}</span>
        </Link>

        {/* Mobile Cart + Menu */}
        <div className="flex relative left-4">
          {/* Cart Button */}
          <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button
              onClick={() => setOpenCartSheet(true)}
              variant="Ghost"
              size="icon"
              className="relative lg:hidden"
            >
              <ShoppingCart strokeWidth={1.2} className="h-4 w-4" />
              {cartItems.length > 0 && (
                <span className="absolute top-[-2px] right-[4px] font-bold text-xs">
                  {cartItems.length}
                </span>
              )}
              <span className="sr-only">User cart</span>
            </Button>
            <UserCartWrapper
              cartItems={cartItems}
              setOpenCartSheet={setOpenCartSheet}
              setOpenMobileCartSheet={setOpenMobileCartSheet}
            />
          </Sheet>

          {/* Mobile Menu */}
          <Sheet open={openMobileCartSheet} onOpenChange={setOpenMobileCartSheet}>
            <SheetTrigger asChild>
              <Button onClick={() => setOpenMobileCartSheet(true)} className="lg:hidden" variant="Ghost">
                <Menu strokeWidth={1} className="h-4 w-4" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[200px]">
              <div className="flex flex-col h-full w-full items-center gap-6">
                <MenuItems setOpenMobileCartSheet={setOpenMobileCartSheet} />
                <HeaderRightContent
                  setOpenMobileCartSheet={setOpenMobileCartSheet}
                  openMobileCartSheet={openMobileCartSheet}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;