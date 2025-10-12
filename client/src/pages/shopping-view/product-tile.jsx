import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { useNavigate } from "react-router-dom";

const ShoppingProductTile = ({ product, handleGetProductDetails, setOpen =() => {} }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => {
        handleGetProductDetails(product?._id);
        navigate(`/product-detail/${product._id}`);
        setOpen(true);
      }}
      className="group w-full max-w-sm mx-auto cursor-pointer overflow-hidden border border-gray-100 rounded-2xl shadow-none"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product?.image[0]}
          alt={product?.title}
          className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Status Badge */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            Out of Stock
          </Badge>
        ) : product?.totalStock <= 10 ? (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white">
            Only {product.totalStock} left
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            Sale
          </Badge>
        ) : null}
      </div>

      {/* Product Info */}
      <CardContent className="p-4">
        {/* Title */}
        <h2 className="text-base md:text-lg font-medium text-gray-800 mb-2 tracking-wide line-clamp-1">
          {product?.title}
        </h2>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs md:text-base font-medium ${
              product?.salePrice > 0 ? "line-through text-gray-400" : "text-gray-500"
            }`}
          >
            ₹{product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-sm md:text-base">
              ₹{product?.salePrice}
            </span>
          )}
        </div>

        {/* Colors Section */}
        {product?.colors?.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1.5">
              {product?.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.code }}
                  title={color.colorName}
                ></div>
              ))}
              {product?.colors.length > 5 && (
                <span className="text-xs text-gray-400">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingProductTile;