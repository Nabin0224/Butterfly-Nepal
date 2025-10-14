import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Mail, Phone } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { shoppingViewHeaderMenuItems } from "@/config";
import { toast } from "@/hooks/use-toast";
import { Store_Name } from "../../utils/constants/storeConstants";

const ShoppingFooter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (menuItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search"
        ? { category: [menuItem.id] }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${menuItem.id}`));
    } else {
      setTimeout(() => navigate(menuItem.path), 400);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue) {
      toast({ title: "Please enter your email!", duration: 2000 });
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/subscribe/getSubscribed`, {
        email: inputValue,
      });
      toast({
        title: res?.data?.message,
        duration: 2000,
      });
      setInputValue("");
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong", duration: 2000 });
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-200 border-t border-neutral-800 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* --- Brand + Subscribe Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-10">
          <h1 className="font-serif text-4xl md:text-6xl tracking-wide text-white">
            {Store_Name}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto"
          >
            <Input
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your email"
              className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-400 focus:ring-2 focus:ring-yellow-500 md:w-72"
            />
            <Button
              type="submit"
              variant="default"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium tracking-wider md:px-6"
            >
              SUBSCRIBE
            </Button>
          </form>
        </div>

        <Separator className="opacity-40 my-6" />

        {/* --- Footer Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white mb-2">Get Connected</h3>
            <div className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 transition-colors">
              <Phone className="h-4 w-4" />
              <p className="text-sm">9863141737</p>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 hover:text-yellow-400 transition-colors">
              <Mail className="h-4 w-4" />
              <p className="text-sm">butterflynepal7@gmail.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white mb-2">Quick Links</h3>
            <p className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors cursor-pointer">
              {Store_Name}
            </p>
            <p className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors cursor-pointer">
              Contact Us
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white mb-2">Shop Now</h3>
            {shoppingViewHeaderMenuItems.map((menuItem) => (
              <p
                key={menuItem.id}
                onClick={() => handleNavigate(menuItem)}
                className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors cursor-pointer"
              >
                {menuItem.label}
              </p>
            ))}
          </div>

          {/* Legals */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white mb-2">Legals</h3>
            <p
              onClick={() => navigate("/legal")}
              className="text-sm text-neutral-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              Exchange & Refunds
            </p>
          </div>
        </div>

        <Separator className="opacity-30 my-6" />

        {/* --- Copyright --- */}
        <div className="text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} {Store_Name} — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default ShoppingFooter;