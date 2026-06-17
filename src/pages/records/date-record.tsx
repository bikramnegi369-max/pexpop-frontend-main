import { Badge } from "flowbite-react";
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
  HiHome,
  HiCurrencyDollar,
  HiUserGroup,
  HiCash,
  HiTrendingUp,
  HiOutlineArchive,
  HiCalendar,
} from "react-icons/hi";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const COLOR = {
  blue: {
    pip: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  green: {
    pip: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
  },
  yellow: {
    pip: "bg-yellow-500",
    text: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
  },
  red: {
    pip: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
};

function getLast30DaysRange() {
  const end = new Date();
  // Normalize end to the very end of today
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  // Subtract 29 days to get a total of 30 days inclusive of today
  start.setDate(start.getDate() - 29);
  // Normalize start to the very beginning of that day
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

const DateRecordPage: FC = function () {
  const range = getLast30DaysRange();
  const navigate = useNavigate();

  const [dateRecords, setDateRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionRange, setSelectionRange] = useState({
    startDate: range.start,
    endDate: range.end,
    key: "selection",
  });

  // Compute Totals for the Summary Header
  const totals = dateRecords.reduce(
    (acc, curr) => ({
      saleUsd: acc.saleUsd + (Number(curr.total_sale_usd) || 0),
      saleInr: acc.saleInr + (Number(curr.total_sale_inr) || 0),
      costing: acc.costing + (Number(curr.costing_inr) || 0),
      profit: acc.profit + (Number(curr.total_profit) || 0),
      commission: acc.commission + (Number(curr.total_agent_commission) || 0),
    }),
    { saleUsd: 0, saleInr: 0, costing: 0, profit: 0, commission: 0 },
  );

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
      <div className="mx-auto w-full max-w-screen-xl px-3 py-4 sm:px-5 sm:py-6 lg:p-8">
        {/* ── Header Section ────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col gap-6 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 sm:mb-5">
              <Link
                to="/"
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <HiHome className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-600 dark:text-gray-300">
                Date Records
              </span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Date Records
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {loading
                ? "Synchronizing data..."
                : `${dateRecords.length} record${
                    dateRecords.length !== 1 ? "s" : ""
                  } found`}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            <DateRangeFilter
              value={selectionRange}
              onChange={setSelectionRange}
            />
            <AddDateModal getDateRecords={getDateRecords} />
          </div>
        </div>

        {/* ── Summary Cards ─────────────────────────────────────────────── */}
        {!loading && dateRecords.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
            <StatCard
              label="Period Sale (USD)"
              value={totals.saleUsd}
              prefix="$"
              icon={<HiCurrencyDollar />}
              color="blue"
            />
            <StatCard
              label="Period Sale (INR)"
              value={totals.saleInr}
              prefix="₹"
              icon={<HiCash />}
              color="green"
            />
            <StatCard
              label="Period Costing"
              value={totals.costing}
              prefix="₹"
              icon={<HiOutlineArchive />}
              color="red"
            />
            <StatCard
              label="Period Commission"
              value={totals.commission}
              prefix="₹"
              icon={<HiUserGroup />}
              color="yellow"
            />
            <StatCard
              label="Period Profit"
              value={totals.profit}
              prefix="₹"
              icon={<HiTrendingUp />}
              color={totals.profit >= 0 ? "green" : "red"}
              /* balance the grid when it's in 3 columns */
              className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-1"
            />
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-700/60"
              />
            ))}
          </div>
        ) : dateRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-white/50 py-24 text-center dark:border-white/5 dark:bg-gray-800/20">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gray-50 dark:bg-gray-800/50">
              <HiOutlineArchive className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              No records found
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-400 dark:text-gray-500">
              There are no entries recorded for the selected period.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dateRecords.map((record: any) => (
              <DateRecordCard
                key={record.id}
                record={record}
                navigate={navigate}
                getDateRecords={getDateRecords}
              />
            ))}
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
};

const DateRecordCard: FC<{
  record: any;
  navigate: any;
  getDateRecords: () => void;
}> = ({ record, navigate, getDateRecords }) => {
  const isProfit = record.total_profit >= 0;
  const hasPending = record.total_pending_entries > 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-gray-800/50 dark:backdrop-blur-sm">
      {/* status stripe */}
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          hasPending ? "bg-red-500" : "bg-green-500"
        }`}
      />

      <div className="p-4 sm:px-5 sm:pt-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4 dark:border-white/5">
          {/* Identity */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <HiCalendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                {dateFormat(record.date, "dd mmm yyyy")}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                  {record.total_entries}{" "}
                  {record.total_entries === 1 ? "entry" : "entries"}
                </span>
                {hasPending && (
                  <Badge
                    color="failure"
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {record.total_pending_entries} Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() =>
                navigate(
                  `/entries-by-date/${dateFormat(record.date, "dd-mmm-yyyy")}`,
                )
              }
              className="flex h-9 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
            >
              <HiArrowRight className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Entries</span>
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

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <MiniStat
            label="Sale (USD)"
            value={`$${Number(record.total_sale_usd).toLocaleString()}`}
          />
          <MiniStat
            label="Sale (INR)"
            value={`₹${Number(record.total_sale_inr).toLocaleString()}`}
          />
          <MiniStat
            label="Costing"
            value={`₹${Number(record.costing_inr).toLocaleString()}`}
          />
          <MiniStat
            label="Commission"
            value={`₹${Number(record.total_agent_commission).toLocaleString()}`}
            valueClass={
              hasPending ? "text-red-600 dark:text-red-400" : undefined
            }
          />
        </div>

        {/* ── Net Profit Block ───────────────────────────────────────────── */}
        <div
          className={`mt-2 rounded-xl border px-4 py-3 sm:mt-3 ${
            isProfit
              ? "border-green-100 bg-green-50/60 dark:border-green-500/20 dark:bg-green-500/10"
              : "border-red-100 bg-red-50/60 dark:border-red-500/20 dark:bg-red-500/10"
          }`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <p
              className={`text-[10px] font-bold uppercase tracking-widest ${
                isProfit
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              Net Profit
            </p>
            <p
              className={`text-base font-black tabular-nums sm:text-lg ${
                isProfit
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              ₹{Number(record.total_profit).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: FC<{
  label: string;
  value: number;
  prefix: string;
  icon: React.ReactNode;
  color: keyof typeof COLOR;
  className?: string;
}> = ({ label, value, prefix, icon, color, className = "" }) => {
  const c = COLOR[color];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-white/5 dark:bg-gray-800/60 dark:backdrop-blur-md sm:p-5 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 ${c.bg}`}
        >
          <span className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${c.text}`}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 sm:text-[10px]">
            {label}
          </p>
          <div className="flex flex-wrap items-baseline gap-x-0.5">
            <span
              className={`text-[10px] font-bold opacity-70 sm:text-xs ${c.text}`}
            >
              {prefix}
            </span>
            <span
              className={`text-sm font-black tabular-nums tracking-tight sm:text-lg lg:text-xl ${c.text}`}
            >
              {value.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 h-1 scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${c.pip}`}
      />
    </div>
  );
};

const MiniStat: FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "text-gray-900 dark:text-white" }) => {
  const isNumeric = /[\d]/.test(value);
  return (
    <div className="rounded-xl bg-gray-50/50 p-2.5 ring-1 ring-inset ring-gray-100/70 transition-colors hover:bg-gray-100 dark:bg-gray-800/40 dark:ring-white/5 dark:hover:bg-gray-800/60">
      <p className="truncate text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 sm:text-[10px]">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate text-xs font-bold sm:text-sm ${
          isNumeric ? "tabular-nums" : ""
        } ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
};
export default DateRecordPage;
