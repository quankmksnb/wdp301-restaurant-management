"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

/**
 * ScrollableTabs – cuộn ngang có nút mũi tên trái/phải.
 *
 * Props:
 *  - children: các <button> hoặc element bên trong
 *  - className: class thêm cho wrapper ngoài
 *  - scrollAmount: số px cuộn mỗi lần bấm (default 160)
 */
export function ScrollableTabs({ children, className = "", scrollAmount = 160 }) {
  const ref = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  // Re-check khi children thay đổi
  useEffect(() => {
    // small delay để DOM render xong
    const t = setTimeout(update, 50);
    return () => clearTimeout(t);
  }, [children, update]);

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Nút trái */}
      <button
        onMouseDown={() => scroll(-1)}
        aria-label="Cuộn trái"
        className={`
          absolute left-0 z-10 flex items-center justify-center
          h-full px-1 bg-gradient-to-r from-white via-white/90 to-transparent
          text-slate-400 hover:text-blue-600 transition-opacity duration-200
          ${canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        <ChevronLeft size={18} strokeWidth={2.5} />
      </button>

      {/* Scroll container */}
      <div
        ref={ref}
        className="flex items-center overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.hide-scroll::-webkit-scrollbar{display:none}`}</style>
        {children}
      </div>

      {/* Nút phải */}
      <button
        onMouseDown={() => scroll(1)}
        aria-label="Cuộn phải"
        className={`
          absolute right-0 z-10 flex items-center justify-center
          h-full px-1 bg-gradient-to-l from-white via-white/90 to-transparent
          text-slate-400 hover:text-blue-600 transition-opacity duration-200
          ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}