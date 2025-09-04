"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useOwlReInit() {
  const pathname = usePathname();

  useEffect(() => {
    const initOwl = () => {
      if (typeof window === "undefined" || !(window as any).jQuery) return;
      const $ = (window as any).jQuery;

      // If Owl Carousel exists
      if ($ && typeof $.fn.owlCarousel === "function") {
        const $carousel = $(".owl-carousel");

        // ✅ Destroy existing carousel safely
        if ($carousel.hasClass("owl-loaded")) {
          try {
            $carousel.trigger("destroy.owl.carousel");
            $carousel.find(".owl-stage-outer").children().unwrap(); // Clean up wrapper
            $carousel.removeClass("owl-loaded owl-hidden"); // Reset state
          } catch (error) {
            console.warn("Owl destroy error:", error);
          }
        }

        // ✅ Initialize carousel after ensuring it's clean
        $carousel.owlCarousel({
          margin: 25,
          loop: true,
          nav: true,
          dots: false,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1300: { items: 4 },
          },
        });
      }
    };

    // ✅ Delay initialization slightly to avoid race conditions
    const timer = setTimeout(initOwl, 400);

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run when route changes
}
