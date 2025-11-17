import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  view,
  columns,
  onAddToCart,
  onWishlist,
  wishlist,
  onQuickView,
  onRate,
  lastProductRef,
}) {
  let containerClass = "";

  if (view === "grid") {
    switch (columns) {
      case 2:
        containerClass = "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6";
        break;
      case 3:
        containerClass =
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6";
        break;
      case 4:
      default:
        containerClass =
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6";
    }
  } else {
    containerClass = "flex flex-col gap-4 mt-6";
  }

  return (
    <div className={containerClass}>
      {products.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">
          No products found.
        </p>
      ) : (
        products.map((product, index) => {
          const isLast = index === products.length - 1;
          return (
            <ProductCard
              key={product.id}
              product={product}
              view={view}
              onAddToCart={onAddToCart}
              onWishlist={onWishlist}
              wishlist={wishlist}
              onQuickView={onQuickView}
              onRate={onRate}
              ref={isLast ? lastProductRef : null}
            />
          );
        })
      )}
    </div>
  );
}
