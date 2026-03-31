import React, { useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

function toCSS(w: string): string {
  const bracket = w.match(/w-\[(.+)\]/);
  if (bracket) return bracket[1];
  const fixed: Record<string, string> = {
    "w-80": "20rem",
    "w-96": "24rem",
    "w-[26rem]": "26rem",
    "w-[32rem]": "32rem",
    "w-[36rem]": "36rem",
    "w-[38rem]": "38rem",
    "w-[40rem]": "40rem",
  };
  return fixed[w] ?? "26rem";
}

const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  width = "w-[26rem]",
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const preventScroll = useCallback((e: Event) => {
    if (!scrollRef.current) {
      e.preventDefault();
      return;
    }
    if (scrollRef.current.contains(e.target as Node)) return;
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [isOpen, onClose, preventScroll]);

  if (!isOpen) return null;

  const mobile = window.innerWidth < 640;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end pb-10 sm:items-center justify-center p-0 sm:p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "modalBgIn 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes modalBgIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        ref={modalRef}
        className="bg-white shadow-2xl relative rounded-t-2xl rounded-b-2xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{
          animation: "modalSlideIn 0.2s ease-out",
          width: "100%",
          maxWidth: `min(${toCSS(width)}, calc(100vw - 2rem))`,
          maxHeight: mobile ? "75vh" : "90vh",
        }}
      >
        <div className="h-1 w-full bg-purple-600 shrink-0" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="p-5 sm:p-7">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
