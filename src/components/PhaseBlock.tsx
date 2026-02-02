import React, { useState } from "react";

export type Phase = {
  name: string;
  startWeek: number;
  duration: number;
  usedWeeks?: number;
  color?: string;
  owner: string;
  status?: "onTime" | "risk" | "delayed";
};

interface PhaseBlockProps extends Phase {
  top?: number;
  weekWidth?: number;
  onEdit?: (phase: Phase) => void;
}

const PhaseBlock: React.FC<PhaseBlockProps> = ({
  name,
  startWeek,
  duration,
  usedWeeks,
  color = "#7c3aed",
  top = 0,
  weekWidth = 24,
  owner,
  status = "onTime",
  onEdit,
}) => {
  const [hover, setHover] = useState(false);

  const leftPosition = (startWeek - 1) * weekWidth;
  const actualWidth = usedWeeks ? usedWeeks * weekWidth : 0;

  const statusColor =
    status === "onTime" ? "#16a34a" : status === "risk" ? "#f59e0b" : "#dc2626";

  const handleClick = () => {
    if (onEdit) {
      onEdit({ name, startWeek, duration, usedWeeks, owner, status, color });
    }
  };

  return (
    <div
      className="absolute h-6 cursor-pointer"
      style={{
        left: `${leftPosition}px`,
        top: `${top}px`,
        width: `${duration * weekWidth}px`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      <div className="relative h-full w-full">
        <div
          className="absolute h-full rounded-l left-0 top-0"
          style={{
            width: `${duration * weekWidth}px`,
            backgroundColor: color,
          }}
        />

        {usedWeeks && (
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

        <div className="absolute w-full text-center text-white text-xs top-0 h-full flex items-center justify-center pointer-events-none">
          {name}
        </div>

        {hover && (
          <div className="absolute -top-16 -left-5 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
            <div className="font-semibold">{name}</div>
            <div>
              Vecka {startWeek} - {startWeek + duration - 1}
            </div>
            {owner && <div>Ansvarig: {owner}</div>}
            {usedWeeks !== undefined && (
              <div>
                Förbrukade veckor: {usedWeeks} / Planerat: {duration}
              </div>
            )}
            <div>Status: {status}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseBlock;
