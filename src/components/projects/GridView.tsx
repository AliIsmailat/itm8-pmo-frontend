import React from "react";
import type { Project } from "./ProjectTable";

interface Props {
  projects: Project[];
}

const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

function getWeek(dateStr: string) {
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = +date - +start;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = +now - +start;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

function getMonthSpans() {
  return [
    { name: "Jan", span: 4 },
    { name: "Feb", span: 4 },
    { name: "Mar", span: 5 },
    { name: "Apr", span: 4 },
    { name: "Maj", span: 4 },
    { name: "Jun", span: 5 },
    { name: "Jul", span: 4 },
    { name: "Aug", span: 4 },
    { name: "Sep", span: 5 },
    { name: "Okt", span: 4 },
    { name: "Nov", span: 4 },
    { name: "Dec", span: 5 },
  ];
}

const GridView: React.FC<Props> = ({ projects }) => {
  const customers = Array.from(new Set(projects.map((p) => p.customer)));
  const months = getMonthSpans();
  const currentWeek = getCurrentWeek();

  return (
    <div className="border rounded-xl bg-white shadow text-xs overflow-hidden">
      <div
        className="grid bg-gray-50 border-b"
        style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
      >
        <div className="p-2 font-semibold border-r">Kund</div>

        {months.map((m) => (
          <div
            key={m.name}
            className="text-center border-l font-medium py-2"
            style={{ gridColumn: `span ${m.span}` }}
          >
            {m.name}
          </div>
        ))}
      </div>

      <div
        className="grid bg-gray-50 border-b"
        style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
      >
        <div className="border-r" />

        {weeks.map((w) => (
          <div
            key={w}
            className={`text-center border-l py-1 text-[10px] ${
              w === currentWeek ? "bg-purple-200 font-bold" : ""
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {customers.map((customer) => {
        const customerProjects = projects.filter(
          (p) => p.customer === customer,
        );

        return (
          <div key={customer}>
            <div
              className="grid bg-gray-50 border-t"
              style={{ gridTemplateColumns: `160px repeat(52, 1fr)` }}
            >
              <div className="p-2 border-r font-bold">{customer}</div>
              {weeks.map((w) => (
                <div
                  key={w}
                  className={`border-l h-6 ${
                    w === currentWeek ? "bg-purple-50" : ""
                  }`}
                />
              ))}
            </div>

            {customerProjects.map((p) => {
              const start = getWeek(p.startDate);
              const end = getWeek(p.endDate);

              return (
                <div
                  key={p.id}
                  className="grid relative border-t"
                  style={{
                    gridTemplateColumns: `160px repeat(52, 1fr)`,
                  }}
                >
                  <div className="border-r px-3 py-1 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="text-[13px] border-l pl-2 border-gray-300">
                      {p.name}
                    </div>
                  </div>

                  {weeks.map((w) => (
                    <div
                      key={w}
                      className={`border-l h-8 ${
                        w === currentWeek ? "bg-purple-50" : ""
                      }`}
                    />
                  ))}

                  <div
                    className="absolute left-[160px] right-0 top-0 bottom-0 grid items-center pointer-events-none"
                    style={{
                      gridTemplateColumns: `repeat(52, 1fr)`,
                    }}
                  >
                    <div
                      style={{ gridColumn: `${start} / ${end + 1}` }}
                      className="mx-[1px] bg-purple-600 rounded shadow h-4"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GridView;
