import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import ShoppingProducttile from "./product-tile";
import { categoriesWithImage } from "../../config/index";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/product-slice/index";
import {
  addToCart,
  fetchCartItems,
} from "../../../store/shop/cart-slice/index";
import { getFeatureImages } from "../../../store/common/index";

export const ShoppingHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { productList } = useSelector((state) => state.shoppingProducts);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { featureImagesList } = useSelector((state) => state.featureImage);
  const { user } = useSelector((state) => state.auth);

  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Auto image slider ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featureImagesList?.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featureImagesList?.length]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: {} }));
    dispatch(getFeatureImages());
    sessionStorage.removeItem("filters")
  }, [dispatch]);

  const handleAddtoCart = (productId, totalStock) => {
    const items = cartItems.items || [];
    const existing = items.find((item) => item.productId === productId);

    if (existing && existing.quantity + 1 > totalStock) {
      toast({
        title: `Only ${existing.quantity} items can be added for this product`,
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
      (data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({ title: "Added to cart!", duration: 1500 });
        }
      }
    );
  };

  const handleFilter = (section, value) => {
    const newFilter = { [section]: [value] };
    sessionStorage.setItem("filters", JSON.stringify(newFilter));
    navigate("/listing");
  };
  const categoryVariants = {
    hiddenLeft: { x: -80, opacity: 0, scale: 0.95 },
    hiddenRight: { x: 80, opacity: 0, scale: 0.95 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.1,
        type: "spring",
        stiffness: 80,
        damping: 18,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
        {featureImagesList?.map((slide, index) => (
          <img
            key={index}
            src={slide?.image}
            className={`absolute w-full h-full object-cover transition-all duration-[1500ms] ease-in-out 
              ${
                index === currentIndex
                  ? "opacity-100 scale-105"
                  : "opacity-0 scale-100"
              }`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

        {/* Hero Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Get up to{" "}
            <span className="text-yellow-400 text-6xl md:text-7xl">
              30% OFF
            </span>{" "}
            on First Purchase
          </h1>
          <p className="text-lg md:text-xl mb-6 mt-2 opacity-90">
            Shop the latest trends and enjoy exclusive festival offers.
          </p>
          <Button
            onClick={() => navigate("/listing")}
            className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 hover:bg-yellow-300 transition-all duration-300"
          >
            Shop Now
          </Button>
        </div>
      </div>

      {/* ================= CATEGORY SECTION ================= */}

      <section className="py-14 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-12 tracking-tight">
            Shop by Category
          </h2>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categoriesWithImage?.category.map((item, index) => {
              const direction = index % 2 === 0 ? "hiddenLeft" : "hiddenRight";

              return (
                <motion.div
                  key={item.id}
                  variants={categoryVariants} // ✅ Attach the whole variants object
                  initial={direction} // ✅ Start from left or right based on index
                  whileInView="visible" // ✅ Animate to visible when in view
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    delay: index * 0.15,
                    ...categoryVariants.visible.transition,
                  }}
                  onClick={() => handleFilter("category", item.id)}
                  className="cursor-pointer group bg-white rounded-2xl shadow-sm hover:shadow-xl 
                       transition-all duration-500 p-6 flex flex-col items-center 
                       hover:scale-105 hover:-translate-y-1"
                >
                  <motion.img
                    src={item.image}
                    alt={item.label}
                    className="object-contain w-28 h-28 md:w-32 md:h-32 rounded-lg 
                         group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    whileHover={{ rotate: 2, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  />
                  <p className="mt-4 text-lg font-medium text-gray-700 group-hover:text-yellow-500 transition-colors duration-300">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      {/* ================= HOTTEST SECTION ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.length > 0 ? (
              productList
                .slice(0, 10)
                .map((item) => (
                  <ShoppingProducttile
                    key={item._id}
                    product={item}
                    handleGetProductDetails={() =>
                      dispatch(fetchProductDetails(item._id))
                    }
                    handleAddtoCart={() =>
                      handleAddtoCart(item._id, item.totalStock)
                    }
                  />
                ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No products available yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShoppingHome;
