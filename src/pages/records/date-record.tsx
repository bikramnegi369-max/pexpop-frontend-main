import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { useNavigate } from "react-router";
import EditDateModal from "../../components/date-records/edit-date-record";
import DeleteDateModal from "../../components/date-records/delete-date-record";
import AddDateModal from "../../components/date-records/add-date-record";
import DateRangeFilter from "../../components/DateRangeFilter";
import { HiArrowRight, HiCalendar } from "react-icons/hi";

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
      <div className="w-full space-y-5 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Date Records
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {loading
                ? "Loading…"
                : `${dateRecords.length} record${
                    dateRecords.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <DateRangeFilter
              value={selectionRange}
              onChange={setSelectionRange}
            />
            <AddDateModal getDateRecords={getDateRecords} />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        ) : dateRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 dark:border-gray-600 dark:bg-gray-800">
            <HiCalendar className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
              No records found for this range
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dateRecords.map((record: any) => (
              <div
                key={record.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Status bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    record.total_pending_entries > 0
                      ? "bg-red-400"
                      : "bg-green-400"
                  }`}
                />

                <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:p-5 sm:pl-6">
                  {/* Date + entries */}
                  <div className="min-w-[130px]">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {dateFormat(record.date, "dd mmm yyyy")}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          record.total_pending_entries > 0
                            ? "bg-red-400"
                            : "bg-green-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {record.total_entries} entries
                        {record.total_pending_entries > 0 && (
                          <span className="ml-1 text-red-500">
                            · {record.total_pending_entries} pending
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCell
                      label="Sale (USD)"
                      value={`$ ${Number(
                        record.total_sale_usd,
                      ).toLocaleString()}`}
                    />
                    <StatCell
                      label="Sale (INR)"
                      value={`₹ ${Number(
                        record.total_sale_inr,
                      ).toLocaleString()}`}
                    />
                    <StatCell
                      label="Costing"
                      value={`₹ ${Number(record.costing_inr).toLocaleString()}`}
                    />
                    <StatCell
                      label="Profit"
                      value={`₹ ${Number(
                        record.total_profit,
                      ).toLocaleString()}`}
                      highlight={record.total_profit > 0}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-2 lg:flex-row">
                    <button
                      onClick={() =>
                        navigate(
                          `/entries-by-date/${dateFormat(
                            record.date,
                            "dd-mmm-yyyy",
                          )}`,
                        )
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-95 sm:flex-none"
                    >
                      Entries
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

const StatCell: FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-700/50">
    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
      {label}
    </p>
    <p
      className={`mt-0.5 text-sm font-semibold ${
        highlight
          ? "text-green-600 dark:text-green-400"
          : "text-gray-800 dark:text-gray-200"
      }`}
    >
      {value}
    </p>
  </div>
);

export default DateRecordPage;
