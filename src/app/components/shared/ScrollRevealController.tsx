"use client";

import { useEffect } from "react";

const TEXT_SELECTOR = [
  "section :is(h1, h2, h3, h4, h5, h6, p, figcaption)",
  "footer :is(h1, h2, h3, h4, h5, h6, p, figcaption, li)",
].join(", ");

const MEDIA_SELECTOR = [
  "section :is(img, picture, video, iframe)",
  "footer :is(img, picture, video, iframe)",
].join(", ");

const TARGET_SELECTOR = `${TEXT_SELECTOR}, ${MEDIA_SELECTOR}`;
const IGNORE_SELECTOR =
  "[data-scroll-reveal-ignore], [aria-hidden='true'], nav";

const REVEAL_CLASS = "scroll-reveal";
const VISIBLE_CLASS = "is-revealed";
const REVEAL_TIMEOUT_MS = 1950;

const isHTMLElement = (element: Element): element is HTMLElement =>
  element instanceof HTMLElement;

const isMediaElement = (element: Element) =>
  element.matches("img, picture, video, iframe");

const hasVisibleText = (element: Element) =>
  (element.textContent ?? "").trim().length > 0;

const shouldReveal = (element: Element) => {
  if (!isHTMLElement(element)) return false;

  if (element.closest(IGNORE_SELECTOR)) return false;

  if (isMediaElement(element)) {
    if (element.closest(".pointer-events-none, .fixed, .absolute")) {
      return false;
    }

    if (element instanceof HTMLImageElement) {
      const alt = element.getAttribute("alt");
      if (!alt || alt.trim() === "") return false;
    }

    return true;
  }

  return hasVisibleText(element);
};

const mediaDirectionClass = (element: Element, index: number) => {
  if (!isHTMLElement(element)) return "reveal-from-bottom";

  const rect = element.getBoundingClientRect();
  const center = rect.left + rect.width / 2;
  const width =
    window.innerWidth || document.documentElement.clientWidth;

  if (center < width * 0.42) return "reveal-from-left";
  if (center > width * 0.58) return "reveal-from-right";

  return index % 2 === 0
    ? "reveal-from-bottom"
    : "reveal-scale-up";
};

const ScrollRevealController = () => {
  useEffect(() => {
    const root = document.querySelector(
      "[data-scroll-reveal-root]"
    );

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!root || reduceMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const observed = new WeakSet<Element>();
    const sectionCounts = new WeakMap<Element, number>();
    const timers = new WeakMap<Element, number>();

    const clearRevealTimer = (element: Element) => {
      const timer = timers.get(element);
      if (timer) window.clearTimeout(timer);
    };

    const hideElement = (element: Element) => {
      if (!isHTMLElement(element)) return;

      clearRevealTimer(element);
      element.classList.remove(VISIBLE_CLASS);
      element.classList.add(REVEAL_CLASS);
      element.dataset.scrollRevealVisible = "false";
    };

    const showElement = (element: Element) => {
      if (!isHTMLElement(element)) return;

      clearRevealTimer(element);
      element.dataset.scrollRevealVisible = "true";
      element.classList.add(REVEAL_CLASS);

      window.requestAnimationFrame(() => {
        if (element.dataset.scrollRevealVisible !== "true") return;

        element.classList.add(VISIBLE_CLASS);

        const timer = window.setTimeout(() => {
          if (element.dataset.scrollRevealVisible === "true") {
            element.classList.remove(REVEAL_CLASS, VISIBLE_CLASS);
          }
        }, REVEAL_TIMEOUT_MS);

        timers.set(element, timer);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showElement(entry.target);
          } else {
            hideElement(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.16,
      }
    );

    const prepareElement = (element: Element) => {
      if (observed.has(element) || !shouldReveal(element)) return;

      const section = element.closest("section, footer") ?? root;
      const index = sectionCounts.get(section) ?? 0;
      const delay = Math.min(index * 80, 480);

      sectionCounts.set(section, index + 1);
      observed.add(element);

      if (isHTMLElement(element)) {
        element.style.setProperty(
          "--scroll-reveal-delay",
          `${delay}ms`
        );

        element.classList.add(
          isMediaElement(element)
            ? "scroll-reveal-media"
            : "scroll-reveal-text"
        );

        if (isMediaElement(element)) {
          element.classList.add(
            mediaDirectionClass(element, index)
          );
        }
      }

      hideElement(element);
      observer.observe(element);
    };

    const prepareAll = () => {
      root
        .querySelectorAll(TARGET_SELECTOR)
        .forEach(prepareElement);
    };

    let pendingFrame = 0;

    const schedulePrepare = () => {
      if (pendingFrame) return;

      pendingFrame = window.requestAnimationFrame(() => {
        pendingFrame = 0;
        prepareAll();
      });
    };

    prepareAll();

    const mutationObserver = new MutationObserver(schedulePrepare);

    mutationObserver.observe(root, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();

      if (pendingFrame) {
        window.cancelAnimationFrame(pendingFrame);
      }
    };
  }, []);

  return null;
};

export default ScrollRevealController;