import { useState, useEffect, useRef, type FC } from "react";
import {
  DateRangePicker,
  defaultStaticRanges,
  type RangeKeyDict,
} from "react-date-range";
import dateFormat from "dateformat";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Range {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface Props {
  value: Range;
  onChange: (range: Range) => void;
}

const DateRangeFilter: FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    const match = defaultStaticRanges.find((r) => {
      const { startDate, endDate } = (
        r.range as () => { startDate: Date; endDate: Date }
      )();
      return (
        dateFormat(startDate, "yyyy-mm-dd") ===
          dateFormat(value.startDate, "yyyy-mm-dd") &&
        dateFormat(endDate, "yyyy-mm-dd") ===
          dateFormat(value.endDate, "yyyy-mm-dd")
      );
    });
    setActiveLabel(match?.label ?? null);
  }, [value]);

  const handlePickerChange = (e: RangeKeyDict) => {
    const s = e["selection"];
    onChange({
      ...value,
      startDate: s?.startDate ?? new Date(),
      endDate: s?.endDate ?? new Date(),
    });
  };

  const handleStaticRange = (range: typeof defaultStaticRanges[0]) => {
    const { startDate, endDate } = (
      range.range as () => { startDate: Date; endDate: Date }
    )();
    onChange({ ...value, startDate, endDate });
    setActiveLabel(range.label ?? null);
    if (!isMobile) setOpen(false);
  };

  const displayValue = `${dateFormat(
    value.startDate,
    "dd mmm yyyy"
  )} – ${dateFormat(value.endDate, "dd mmm yyyy")}`;

  return (
    <div ref={containerRef} className="relative w-full sm:max-w-sm">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-500"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <svg
            className="h-4 w-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          {activeLabel ? (
            <>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {activeLabel}
              </span>
              <span className="truncate text-xs text-gray-400 dark:text-gray-500">
                {displayValue}
              </span>
            </>
          ) : (
            <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
              {displayValue}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            role="button"
            tabIndex={-1}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          />

          {/* ── Mobile: bottom sheet ── */}
          {isMobile && (
            <div className="bottom-sheet-enter fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl dark:bg-gray-900">
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-900">
                <div className="flex justify-center pt-3 pb-1">
                  <div className="h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-700">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    Filter by Date
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-4 pt-4 pb-2">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Quick Select
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {defaultStaticRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handleStaticRange(range)}
                      className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition active:scale-95 ${
                        activeLabel === range.label
                          ? "border-blue-500 bg-blue-500 text-white dark:border-blue-500 dark:bg-blue-600"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center overflow-x-auto px-2">
                <DateRangePicker
                  ranges={[value]}
                  onChange={handlePickerChange}
                  months={1}
                  staticRanges={[]}
                  inputRanges={[]}
                  direction="vertical"
                  moveRangeOnFirstSelection={false}
                />
              </div>
              <div className="sticky bottom-0 bg-white px-4 pb-8 pt-3 dark:bg-gray-900">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                >
                  Apply — {displayValue}
                </button>
              </div>
            </div>
          )}

          {/* ── Desktop: centered modal ── */}
          {!isMobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                {/* Left sidebar — quick ranges */}
                <div className="flex w-44 flex-col border-r border-gray-100 dark:border-gray-700">
                  <div className="px-4 pt-5 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Quick Select
                    </p>
                  </div>
                  <nav className="flex-1 space-y-0.5 px-2 pb-4">
                    {defaultStaticRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => handleStaticRange(range)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          activeLabel === range.label
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {activeLabel === range.label && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        )}
                        <span
                          className={
                            activeLabel === range.label ? "" : "pl-3.5"
                          }
                        >
                          {range.label}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Right — calendar + header */}
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Select Date Range
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {displayValue}
                      </p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="ml-8 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Calendar */}
                  <div className="p-4">
                    <DateRangePicker
                      ranges={[value]}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      direction="horizontal"
                      staticRanges={[]}
                      inputRanges={[]}
                      onChange={(e: RangeKeyDict) => {
                        const s = e["selection"];
                        const startDate = s?.startDate ?? new Date();
                        const endDate = s?.endDate ?? new Date();
                        onChange({ ...value, startDate, endDate });
                        if (startDate.getTime() !== endDate.getTime())
                          setOpen(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;
