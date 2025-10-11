import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "./product-tile";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../../store/shop/product-slice";
import {
  addToCart,
  fetchCartItems,
} from "../../../store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { sortOptions } from "@/config/index";

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialogue, setOpenDetailsDialogue] = useState(false);

  const { productList } = useSelector((state) => state.shoppingProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const categorySearchParams = searchParams.get("category");

  // 🧠 Fetch product details
  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  // 🧠 Create query string from filters
  function createSearchParamsHelper(filterParams) {
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
      }
    }
    return queryParams.join("&");
  }

  // 🧠 Handle sorting
  function handleSort(value) {
    setSort(value);
  }

  // 🧠 Handle filter selection
  function handleFilter(sectionId, currentOption) {
    if (!sectionId || !currentOption) return;
    let updatedFilters = { ...filters };

    if (!updatedFilters[sectionId]) {
      updatedFilters[sectionId] = [currentOption];
    } else {
      const optionIndex = updatedFilters[sectionId].indexOf(currentOption);
      optionIndex === -1
        ? updatedFilters[sectionId].push(currentOption)
        : updatedFilters[sectionId].splice(optionIndex, 1);
    }

    updatedFilters = Object.fromEntries(
      Object.entries(updatedFilters).filter(([_, value]) => value.length > 0)
    );

    setFilters(updatedFilters);
    sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
  }

  // 🛒 Handle Add to Cart
  function handleAddToCart(productId, totalStock) {
    if (!user) {
      toast({
        title: "Please log in to continue",
        variant: "destructive",
      });
      return;
    }

    const cart = cartItems.items || [];
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem && existingItem.quantity + 1 > totalStock) {
      toast({
        title: `Only ${totalStock} items available`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: user.id, productId, quantity: 1 })).then(
      (res) => {
        if (res?.payload?.success) {
          dispatch(fetchCartItems(user.id));
          toast({
            title: "Product added to cart",
            duration: 1500,
          });
        }
      }
    );
  }

  // 🧩 Initialize filters from session or URL
  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    setFilters(storedFilters);
  }, [categorySearchParams]);

  // 🧩 Update URL query params when filters change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const queryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(queryString));
    }
  }, [filters]);

  // 🧩 Fetch filtered products
  useEffect(() => {
    if (filters && sort) {
      const sanitizedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v.length > 0)
      );
      dispatch(
        fetchAllFilteredProducts({
          filterParams: sanitizedFilters,
          sortParams: sort,
        })
      );
    }
  }, [dispatch, filters, sort]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Left Sidebar */}
      <div className="hidden md:block bg-white rounded-xl shadow-md p-4">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>

      {/* Right Product Section */}
      <div className="bg-white rounded-xl shadow-md flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b p-4 md:p-6 gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            All Products
          </h2>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-500">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown size={16} />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem key={item.id} value={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        {productList?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4 md:p-6">
            {productList.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                setOpen={setOpenDetailsDialogue}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 py-24">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-gray-500">
              Try adjusting filters or sorting options
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingListing;