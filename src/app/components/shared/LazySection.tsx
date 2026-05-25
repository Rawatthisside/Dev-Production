"use client";

import { Suspense, useEffect, useRef, useState } from "react";

interface LazySectionProps {
  component: React.ComponentType<any>;
  placeholderClassName?: string;
}

const LazySection = ({
  component: Component,
  placeholderClassName = "min-h-[55vh] bg-white/0",
}: LazySectionProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [loadSection, setLoadSection] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || loadSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadSection(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [loadSection]);

  return (
    <div ref={wrapperRef} className={placeholderClassName}>
      {loadSection ? (
        <Suspense fallback={<div className="min-h-[55vh] bg-white" />}>
          <Component />
        </Suspense>
      ) : null}
    </div>
  );
};

export default LazySection;