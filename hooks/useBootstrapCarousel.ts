"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useBootstrapCarousel() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cleanupFns: (() => void)[] = [];

    const initBootstrapCarousels = async () => {
      // ✅ Dynamically import Bootstrap JS on client
    //   const bootstrap = await import("bootstrap");

      // ✅ Select all carousels
      const carouselContainers = document.querySelectorAll<HTMLElement>(".carousel");

      carouselContainers.forEach((cc) => {
        const carouselID = cc.getAttribute("id");
        if (!carouselID) return;

        const carouselMain = document.querySelector<HTMLElement>(`#${carouselID}.carousel`);
        if (!carouselMain) return;

        const carouselItems = document.querySelectorAll<HTMLElement>(
          `#${carouselID} .carousel-inner .carousel-item`
        );

        const thumbPresent = cc.getAttribute("data-bs-thumb");
        const dotsPresent = cc.getAttribute("data-bs-dots");
        const indicatorClass = cc.getAttribute("data-bs-indicator-class");

        if (thumbPresent === "true") {
          // ✅ Create dynamic thumbnails
          const {
            carouselIndicators,
            prevArrow,
            nextArrow,
          } = createIndicatorsWithThumbs(carouselID, indicatorClass, carouselItems, carouselMain);

          const thumbs = carouselIndicators.querySelectorAll<HTMLElement>(".thumb.item");
          if (thumbs[0]) thumbs[0].classList.add("active");

          // ✅ Click handlers for thumbnails
          thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
              thumbs.forEach((t) => t.classList.remove("active"));
              thumb.classList.add("active");
              const bsCarousel = bootstrap.Carousel.getOrCreateInstance(`#${carouselID}`);
              bsCarousel.to(index);
            });
          });

          // ✅ Setup thumb scrolling
          setupThumbScrolling(carouselMain, carouselIndicators, prevArrow, nextArrow, carouselID);
        } else if (dotsPresent === "true") {
          // ✅ Create dynamic dots
          const { carouselIndicators } = createIndicatorsWithDots(carouselID, carouselItems);
          const dots = carouselIndicators.querySelectorAll<HTMLElement>(".dots");
          if (dots[0]) dots[0].classList.add("active");

          dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
              dots.forEach((d) => d.classList.remove("active"));
              dot.classList.add("active");
              const bsCarousel = bootstrap.Carousel.getOrCreateInstance(`#${carouselID}`);
              bsCarousel.to(index);
            });
          });
        }
      });
    };

    // ✅ Functions to dynamically build indicators
    function createIndicatorsWithThumbs(
      carouselID: string,
      indicatorClass: string | null,
      carouselItems: NodeListOf<HTMLElement>,
      carouselMain: HTMLElement
    ) {
      const carouselIndicatorSlideWrap = document.createElement("div");
      carouselIndicatorSlideWrap.classList.add("slider-wrap");

      const carouselIndicatorSlide = document.createElement("div");
      carouselIndicatorSlide.classList.add("slider");

      const carouselIndicators = document.createElement("div");
      carouselIndicators.setAttribute(
        "class",
        `slider-inner carousel-indicators ${indicatorClass || ""}`
      );

      // Arrows
      const prevArrow = document.createElement("a");
      prevArrow.classList.add("carousel-control-prev");
      prevArrow.innerHTML = '<i class="fa fa-angle-left"></i>';

      const nextArrow = document.createElement("a");
      nextArrow.classList.add("carousel-control-next");
      nextArrow.innerHTML = '<i class="fa fa-angle-right"></i>';

      carouselIndicatorSlide.appendChild(carouselIndicators);
      carouselIndicatorSlideWrap.appendChild(carouselIndicatorSlide);
      carouselIndicatorSlideWrap.appendChild(prevArrow);
      carouselIndicatorSlideWrap.appendChild(nextArrow);
      carouselMain.appendChild(carouselIndicatorSlideWrap);

      // ✅ Add thumbnails dynamically
      carouselItems.forEach((el, ind) => {
        const childrenImg = el.innerHTML;
        const htmlCode = `<div data-bs-target="#${carouselID}" data-bs-slide-to="${ind}" class="thumb item">${childrenImg}</div>`;
        carouselIndicators.innerHTML += htmlCode;
      });

      return { carouselIndicators, prevArrow, nextArrow };
    }

    function createIndicatorsWithDots(
      carouselID: string,
      carouselItems: NodeListOf<HTMLElement>
    ) {
      const carouselMain = document.querySelector(`#${carouselID}.carousel`) as HTMLElement;
      const carouselIndicatorSlideWrap = document.createElement("div");
      carouselIndicatorSlideWrap.classList.add("slider-wrap");

      const carouselIndicatorSlide = document.createElement("div");
      carouselIndicatorSlide.classList.add("slider");

      const carouselIndicators = document.createElement("div");
      carouselIndicators.classList.add("slider-inner", "carousel-indicators");

      carouselIndicatorSlide.appendChild(carouselIndicators);
      carouselIndicatorSlideWrap.appendChild(carouselIndicatorSlide);
      carouselMain.appendChild(carouselIndicatorSlideWrap);

      carouselItems.forEach((_, ind) => {
        const htmlCode = `<div data-bs-target="#${carouselID}" data-bs-slide-to="${ind}" class="dots"></div>`;
        carouselIndicators.innerHTML += htmlCode;
      });

      return { carouselIndicators };
    }

    function setupThumbScrolling(
      carouselMain: HTMLElement,
      carouselIndicators: HTMLElement,
      prevArrow: HTMLElement,
      nextArrow: HTMLElement,
      carouselID: string
    ) {
      let currentTranslate = 0;
      const slider = document.querySelector<HTMLElement>(`#${carouselID} .slider`);
      const sliderInner = document.querySelector<HTMLElement>(`#${carouselID} .slider-inner`);

      const checkCarouselIndicatorWidth = () => {
        if (!slider || !sliderInner) return;
        const carouselIndicatorSlideWidth = slider.offsetWidth;
        const dir = document.querySelector("html")?.getAttribute("dir");
        const eValue = Math.ceil(
          Number(window.getComputedStyle(slider.firstElementChild as HTMLElement).transform.split(",")[4])
        );
        const sliderChildWidth = slider.firstElementChild!.scrollWidth - carouselIndicatorSlideWidth;

        if (eValue < -sliderChildWidth && dir !== "rtl") {
          currentTranslate = -sliderChildWidth;
          slider.firstElementChild!.setAttribute("style", `transform: translateX(${currentTranslate}px)`);
        } else if (eValue > sliderChildWidth && dir === "rtl") {
          currentTranslate = sliderChildWidth;
          slider.firstElementChild!.setAttribute("style", `transform: translateX(${currentTranslate}px)`);
        }
      };

      checkCarouselIndicatorWidth();
      window.addEventListener("resize", checkCarouselIndicatorWidth, true);
    }

    // ✅ Delay init to allow DOM hydration
    const timer = setTimeout(initBootstrapCarousels, 300);

    return () => {
      clearTimeout(timer);
      cleanupFns.forEach((fn) => fn());
    };
  }, [pathname]);
}
