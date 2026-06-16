import { useState, useEffect, type FC } from "react";
import Calendar from "react-calendar";
import dateFormat from "dateformat";
import "react-calendar/dist/Calendar.css";

interface Props {
  value: string; // "yyyy/mm/dd"
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

const DatePicker: FC<Props> = ({
  value,
  onChange,
  placeholder = "Select a date",
  hasError,
}) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const parsed = value ? new Date(value.replace(/\//g, "-")) : null;
  const display = parsed ? dateFormat(parsed, "dd mmm yyyy") : "";

  const handleSelect = (date: Date) => {
    onChange(dateFormat(date, "yyyy/mm/dd"));
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:bg-gray-700 ${
          hasError
            ? "border-red-400 focus:ring-red-400/30"
            : "border-gray-200 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500"
        }`}
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
        <span
          className={`flex-1 text-sm ${
            display
              ? "font-medium text-gray-800 dark:text-white"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {display || placeholder}
        </span>
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
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Mobile: bottom sheet */}
          {isMobile && (
            <div className="bottom-sheet-enter fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-2xl dark:bg-gray-900">
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-700">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  Select Date
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
              <div className="flex justify-center p-4">
                <Calendar
                  value={parsed}
                  onChange={(e) => handleSelect(e as Date)}
                />
              </div>
            </div>
          )}

          {/* Desktop: centered modal */}
          {!isMobile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Select Date
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                      {display || "No date selected"}
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
                <div className="p-4">
                  <Calendar
                    value={parsed}
                    onChange={(e) => handleSelect(e as Date)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DatePicker;
