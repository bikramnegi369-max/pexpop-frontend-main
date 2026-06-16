import { Breadcrumb } from "flowbite-react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import EditDateModal from "../../components/date-records/edit-date-record";
import DeleteDateModal from "../../components/date-records/delete-date-record";
import AddDateModal from "../../components/date-records/add-date-record";
import DateRangeFilter from "../../components/DateRangeFilter";
import {
  HiArrowRight,
  HiCalendar,
  HiHome,
  HiOutlineArchive,
} from "react-icons/hi";

function getMonthRange(year: number, month: number) {
  const m = month - 1;
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  return {
    firstDay: fmt(new Date(year, m, 1)),
    lastDay: fmt(new Date(year, m + 1, 0)),
  };
}

const DateRecordPage: FC = function () {
  const today = new Date();
  const { firstDay, lastDay } = getMonthRange(
    today.getFullYear(),
    today.getMonth() + 1,
  );
  const navigate = useNavigate();

  const [dateRecords, setDateRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(firstDay),
    endDate: new Date(lastDay),
    key: "selection",
  });

  const getDateRecords = useCallback(async () => {
    setLoading(true);
    try {
      const from = dateFormat(selectionRange.startDate, "yyyy-mm-dd");
      const to = dateFormat(selectionRange.endDate, "yyyy-mm-dd");
      const res = await api.get(
        `/auth/date-by-date-range/?from=${from}&to=${to}`,
      );
      setDateRecords(res.data.status === "success" ? res.data.data : []);
    } finally {
      setLoading(false);
    }
  }, [selectionRange.startDate, selectionRange.endDate]);

  useEffect(() => {
    getDateRecords();
  }, [selectionRange.startDate, selectionRange.endDate, getDateRecords]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="mx-auto w-full max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-10">
        {/* ── Header Section ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link
                to="/"
                className="flex items-center transition-colors hover:text-blue-600"
              >
                <HiHome className="mr-1 h-3.5 w-3.5" /> Home
              </Link>
              <span>/</span>
              <span className="text-gray-600 dark:text-gray-400">
                Date Records
              </span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Date Records
            </h1>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            <DateRangeFilter
              value={selectionRange}
              onChange={setSelectionRange}
            />
            <AddDateModal getDateRecords={getDateRecords} />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/50"
              />
            ))}
          </div>
        ) : dateRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-white py-24 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
              <HiOutlineArchive className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
              No records found for this range
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dateRecords.map((record: any) => (
              <div
                key={record.id}
                className="group relative overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/5 dark:bg-gray-800/50 dark:backdrop-blur-sm"
              >
                {/* Status bar */}
                <div
                  className={`absolute inset-y-0 left-0 w-1 transition-colors ${
                    record.total_pending_entries > 0
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />

                <div className="flex flex-col gap-6 p-5 pl-8 md:p-6 md:pl-10 lg:flex-row lg:items-center lg:gap-6 xl:gap-12">
                  {/* Date + entries */}
                  <div className="flex flex-col lg:w-44 xl:w-56">
                    <p className="text-base font-black text-gray-900 dark:text-white lg:text-lg">
                      {dateFormat(record.date, "dd mmm yyyy")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          record.total_pending_entries > 0
                            ? "animate-pulse bg-red-500"
                            : "bg-green-500"
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        {record.total_entries}{" "}
                        {record.total_entries === 1 ? "entry" : "entries"}
                        {record.total_pending_entries > 0 && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-0.5 text-[9px] font-black text-red-600 ring-1 ring-inset ring-red-600/10 dark:bg-red-500/10 dark:text-red-400">
                            {record.total_pending_entries} PENDING
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 xl:gap-6">
                    <StatCell
                      label="Sale (USD)"
                      value={`$${Number(
                        record.total_sale_usd,
                      ).toLocaleString()}`}
                    />
                    <StatCell
                      label="Sale (INR)"
                      value={`₹${Number(
                        record.total_sale_inr,
                      ).toLocaleString()}`}
                    />
                    <StatCell
                      label="Costing"
                      value={`₹${Number(record.costing_inr).toLocaleString()}`}
                    />
                    <StatCell
                      label="Profit"
                      value={`₹${Number(record.total_profit).toLocaleString()}`}
                      color={record.total_profit >= 0 ? "green" : "red"}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 border-t border-gray-50 pt-4 lg:ml-auto lg:border-0 lg:pt-0">
                    <button
                      onClick={() =>
                        navigate(
                          `/entries-by-date/${dateFormat(
                            record.date,
                            "dd-mmm-yyyy",
                          )}`,
                        )
                      }
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 sm:flex-none"
                    >
                      <span>Entries</span>{" "}
                      <HiArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <EditDateModal
                      dateRecord={record}
                      dateRecordId={record.id}
                      getDateRecords={getDateRecords}
                    />
                    <DeleteDateModal
                      dateRecordId={record.id}
                      getDateRecords={getDateRecords}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
};

const StatCell: FC<{
  label: string;
  value: string;
  color?: "green" | "red" | "gray";
}> = ({ label, value, color = "gray" }) => {
  const textColor =
    color === "green"
      ? "text-green-600 dark:text-green-400"
      : color === "red"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-900 dark:text-gray-100";

  const bgColor =
    color === "green"
      ? "bg-green-50/40 dark:bg-green-500/10"
      : color === "red"
      ? "bg-red-50/40 dark:bg-red-500/10"
      : "bg-gray-50/50 dark:bg-gray-800/40";

  return (
    <div
      className={`flex flex-col justify-center rounded-2xl p-3.5 ring-1 ring-inset ring-gray-100 transition-all hover:bg-white dark:ring-white/5 md:p-4 ${bgColor}`}
    >
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-black tabular-nums tracking-tight lg:text-base ${textColor}`}
      >
        {value}
      </p>
    </div>
  );
};

export default DateRecordPage;
