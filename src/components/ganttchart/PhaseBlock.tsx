import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

export type Phase = {
  name: string;
  startWeek: number;
  duration: number;
  usedWeeks?: number;
  color?: string;
  owner?: string;
  resources?: string[];
  status?: "onTime" | "risk" | "delayed";
};

interface PhaseBlockProps extends Phase {
  top?: number;
  weekWidth?: number;
  onEdit?: (phase: Phase) => void;
  onDragStart?: (
    type: "move" | "resize-left" | "resize-right",
    clientX: number,
  ) => void;
  isDragging?: boolean;
  hasDragged?: React.MutableRefObject<boolean>;
}

const statusConfig = {
  onTime: { label: "I tid", color: "#16a34a", bg: "#dcfce7", dot: "#16a34a" },
  risk: { label: "Risk", color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  delayed: {
    label: "Försenad",
    color: "#dc2626",
    bg: "#fee2e2",
    dot: "#dc2626",
  },
};

const TOOLTIP_WIDTH = 220;
const TOOLTIP_HEIGHT = 160;
const HANDLE_WIDTH = 8;

const PhaseBlock: React.FC<PhaseBlockProps> = ({
  name,
  startWeek,
  duration,
  usedWeeks,
  color = "#7c3aed",
  top = 0,
  weekWidth = 24,
  owner,
  resources = [],
  status = "onTime",
  onEdit,
  onDragStart,
  isDragging = false,
  hasDragged,
}) => {
  const [hover, setHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const leftPosition = (startWeek - 1) * weekWidth;
  const actualWidth = usedWeeks ? usedWeeks * weekWidth : 0;
  const totalWidth = duration * weekWidth;

  const statusColor =
    status === "onTime" ? "#16a34a" : status === "risk" ? "#f59e0b" : "#dc2626";

  const cfg = statusConfig[status] ?? statusConfig.onTime;

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const endWeek = startWeek + duration - 1;
  const progress =
    usedWeeks != null ? Math.round((usedWeeks / duration) * 100) : null;

  const margin = 12;
  const showAbove = mousePos.y - TOOLTIP_HEIGHT - margin > 0;

  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    width: `${TOOLTIP_WIDTH}px`,
    left: Math.min(
      Math.max(mousePos.x - TOOLTIP_WIDTH / 2, 8),
      window.innerWidth - TOOLTIP_WIDTH - 8,
    ),
    ...(showAbove
      ? { bottom: window.innerHeight - mousePos.y + margin }
      : { top: mousePos.y + margin }),
    filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.18))",
    pointerEvents: "none",
  };

  const tooltip =
    hover && !isDragging ? (
      <div ref={tooltipRef} style={tooltipStyle}>
        <div
          className="bg-white rounded-lg text-gray-800 text-xs"
          style={{ border: "1px solid #e5e7eb", overflow: "hidden" }}
        >
          <div
            className="px-3 py-2 flex items-center justify-between"
            style={{ backgroundColor: color }}
          >
            <span className="font-semibold text-white text-[13px] truncate">
              {name}
            </span>
            <span
              className="text-white text-[10px] ml-2 px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            >
              v.{startWeek}–{endWeek}
            </span>
          </div>

          <div className="px-3 py-2 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cfg.dot }}
                />
                {cfg.label}
              </span>
            </div>

            {progress !== null && (
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                  <span>Förlopp</span>
                  <span>
                    {usedWeeks} / {duration} v. ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: statusColor,
                    }}
                  />
                </div>
              </div>
            )}

            {owner && (
              <div className="flex items-center gap-1 text-[11px] text-gray-600">
                <span className="text-gray-400">Ansvarig:</span>
                <span className="font-medium">{owner}</span>
              </div>
            )}
            {resources.length > 0 && (
              <div className="flex items-start gap-1 text-[11px] text-gray-600">
                <span className="text-gray-400 flex-shrink-0">Resurser:</span>
                <span className="font-medium">{resources.join(", ")}</span>
              </div>
            )}

            <div className="text-[10px] text-gray-400 pt-0.5 border-t border-gray-100 mt-0.5">
              Klicka för att redigera
            </div>
          </div>
        </div>
      </div>
    ) : null;

  const handleMouseDown = (
    e: React.MouseEvent,
    type: "move" | "resize-left" | "resize-right",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStart?.(type, e.clientX);
  };

  return (
    <>
      <div
        className="absolute h-6"
        style={{
          left: `${leftPosition}px`,
          top: `${top + 8}px`,
          width: `${totalWidth}px`,
          opacity: isDragging ? 0.6 : 1,
          transition: isDragging ? "none" : "opacity 0.1s",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Left resize handle */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: 0, width: `${HANDLE_WIDTH}px`, cursor: "ew-resize" }}
          onMouseDown={(e) => handleMouseDown(e, "resize-left")}
        />

        {/* Right resize handle */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ right: 0, width: `${HANDLE_WIDTH}px`, cursor: "ew-resize" }}
          onMouseDown={(e) => handleMouseDown(e, "resize-right")}
        />

        {/* Bar body — move */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: `${HANDLE_WIDTH}px`,
            right: `${HANDLE_WIDTH}px`,
            cursor: isDragging ? "grabbing" : "grab",
          }}
          onMouseDown={(e) => handleMouseDown(e, "move")}
          onClick={() => {
            if (!hasDragged?.current) {
              onEdit?.({
                name,
                startWeek,
                duration,
                usedWeeks,
                owner,
                status,
                color,
                resources,
              });
            }
          }}
        />

        {/* Visual bar */}
        <div className="relative h-full w-full pointer-events-none">
          <div
            className="absolute h-full rounded left-0 top-0"
            style={{ width: `${totalWidth}px`, backgroundColor: color }}
          />
          {usedWeeks != null && (
            <div
              className="absolute rounded-l left-0"
              style={{
                width: `${actualWidth}px`,
                height: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: statusColor,
              }}
            />
          )}
        </div>
      </div>

      {typeof document !== "undefined" && createPortal(tooltip, document.body)}
    </>
  );
};

export default PhaseBlock;
