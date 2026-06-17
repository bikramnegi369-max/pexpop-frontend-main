/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";
import {
  HiHome,
  HiCash,
  HiUserGroup,
  HiTrendingUp,
  HiCurrencyDollar,
  HiUser,
  HiOutlineArchive,
  HiChevronLeft,
  HiChevronRight,
  HiCalendar,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import "react-calendar/dist/Calendar.css";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { Link, useParams } from "react-router-dom";
import EditEntryModal from "../../components/entries/edit-entry";
import SearchEntries from "../../components/entries/search-entries";
import DeleteEntryModal from "../../components/entries/delete-entry";
import AddEntryModal from "../../components/entries/add-entry";

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

// ─── Main Page ────────────────────────────────────────────────────────────────
const EntriesPage: FC = function () {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsd: 0,
    totalInr: 0,
    totalCommission: 0,
    totalProfit: 0,
    totalCosting: 0,
  });

  const { date } = useParams();
  const formatedDate = dateFormat(date || "", "yyyy/mm/dd");

  const getEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/entries-by-date?date=${formatedDate}`);
      if (res.data.status === "success") {
        const entryList = res.data.dateRecord?.entries || [];
        setEntries(entryList);

        const totalUsd = entryList.reduce(
          (a: number, b: any) => a + (Number(b.total_sale_usd) || 0),
          0,
        );
        const totalInr = entryList.reduce(
          (a: number, b: any) => a + (Number(b.total_sale_inr) || 0),
          0,
        );
        const totalCosting = Number(res.data.dateRecord?.costing_inr) || 0;
        const totalCommission = entryList.reduce(
          (a: number, b: any) => a + (Number(b.agent_commission_inr) || 0),
          0,
        );
        const totalProfit = totalInr - (totalCosting + totalCommission);

        setStats({
          totalUsd,
          totalInr,
          totalCosting,
          totalCommission,
          totalProfit,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formatedDate]);

  useEffect(() => {
    getEntries();
  }, [getEntries]);

  const profitColor = stats.totalProfit < 0 ? "red" : "green";

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="mx-auto w-full max-w-screen-xl px-3 py-4 sm:px-5 sm:py-6 lg:p-8">
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 sm:mb-5">
          <Link
            to="/"
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <HiHome className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <span>/</span>
          <Link
            to="/all-entries"
            className="rounded-md px-1.5 py-0.5 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            Date Records
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Entries
          </span>
        </nav>

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="mb-5 flex justify-between gap-3 sm:mb-6 sm:items-start">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <HiCalendar className="h-5 w-5 shrink-0 text-blue-500" />
              <h1 className="text-xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
                {dateFormat(date, "dd mmm yyyy")}
              </h1>
            </div>
            <p className="pl-7 text-sm text-gray-400 dark:text-gray-500">
              {loading
                ? "Loading entries…"
                : `${entries.length} ${
                    entries.length === 1 ? "entry" : "entries"
                  } recorded`}
            </p>
          </div>
          <div className="sm:shrink-0">
            <AddEntryModal getEntries={getEntries} />
          </div>
        </div>
        {/* ── Search Bar ─────────────────────────────────────────────────── */}
        <div className="mb-5 rounded-2xl border border-gray-200/70 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:mb-6">
          <SearchEntries setEntries={setEntries} />
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        {/* 2-col on mobile, 3 on tablet/laptop, 5 on large desktop */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Total Sale (USD)"
            value={stats.totalUsd}
            prefix="$"
            icon={<HiCurrencyDollar />}
            color="blue"
          />
          <StatCard
            label="Total Sale (INR)"
            value={stats.totalInr}
            prefix="₹"
            icon={<HiCash />}
            color="green"
          />
          <StatCard
            label="Total Costing"
            value={stats.totalCosting}
            prefix="₹"
            icon={<HiOutlineArchive />}
            color="red"
          />
          <StatCard
            label="Agent Commission"
            value={stats.totalCommission}
            prefix="₹"
            icon={<HiUserGroup />}
            color="yellow"
          />
          <StatCard
            label="Net Profit"
            value={stats.totalProfit}
            prefix="₹"
            icon={<HiTrendingUp />}
            color={profitColor}
            /* balance the grid when it's in 2 or 3 columns */
            className="col-span-2 sm:col-span-1 md:col-span-2 xl:col-span-1"
          />
        </div>

        {/* ── Entries List ───────────────────────────────────────────────── */}
        <EntriesList
          entries={entries}
          getEntries={getEntries}
          loading={loading}
        />
      </div>
    </NavbarSidebarLayout>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
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

// ─── Entries List ─────────────────────────────────────────────────────────────
interface EntriesListProps {
  entries: any[];
  getEntries: () => void;
  loading: boolean;
}

const EntriesList: FC<EntriesListProps> = ({
  entries,
  getEntries,
  loading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPage = Math.ceil(entries.length / itemsPerPage);
  const currentItems = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset to page 1 when entries change (e.g. after search)
  useEffect(() => {
    setCurrentPage(1);
  }, [entries.length]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-700/60 sm:h-36"
          />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 dark:border-gray-700 dark:bg-gray-800">
        <HiOutlineArchive className="mb-3 h-12 w-12 text-gray-200 dark:text-gray-700" />
        <h3 className="text-base font-bold text-gray-700 dark:text-white">
          No Entries Found
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          No sales entries have been recorded for this date.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {currentItems.map((entry: any) => (
          <EntryCard key={entry._id} entry={entry} getEntries={getEntries} />
        ))}
      </div>

      {totalPage > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPage))}
          onGoto={setCurrentPage}
        />
      )}
    </>
  );
};

// ─── Entry Card ───────────────────────────────────────────────────────────────
const EntryCard: FC<{ entry: any; getEntries: () => void }> = ({
  entry,
  getEntries,
}) => {
  const isPaid = entry.payment_status === "paid";
  const revenue = Number(entry.revenue);
  const isProfit = revenue >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-gray-800/50 dark:backdrop-blur-sm">
      {/* payment status stripe */}
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          isPaid ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4 dark:border-white/5">
          {/* Identity */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <HiUser className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base">
                {entry.name}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                  #{entry._id?.slice(-8)}
                </span>
                <Badge
                  color={isPaid ? "success" : "failure"}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                >
                  {entry.payment_status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5">
            <EditEntryModal
              entry={entry}
              entryId={entry._id}
              getEntries={getEntries}
            />
            <DeleteEntryModal entryId={entry._id} getEntries={getEntries} />
          </div>
        </div>

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        {/* 2-col on mobile, 4 on sm, last block full on mobile  */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <MiniStat
            label="Sale (USD)"
            value={`$${Number(entry.total_sale_usd).toLocaleString()}`}
          />
          <MiniStat
            label="Sale (INR)"
            value={`₹${Number(entry.total_sale_inr).toLocaleString()}`}
          />
          <MiniStat
            label="Agent Comm."
            value={`₹${Number(entry.agent_commission_inr).toLocaleString()}`}
            valueClass="text-yellow-600 dark:text-yellow-400"
          />
          <MiniStat
            label="Agent (INR/USD)"
            value={`₹${Number(entry.agent_commission).toLocaleString()}`}
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
              ₹{revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Sales Breakdown Footer ─────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 bg-gray-50/40 px-4 py-3 dark:border-white/5 dark:bg-gray-900/30 sm:px-5">
        <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-gray-400">
          Sales Breakdown
        </span>
        {[
          { id: "S1", sale: entry.sale1, rate: entry.rate1 },
          { id: "S2", sale: entry.sale2, rate: entry.rate2 },
          { id: "S3", sale: entry.sale3, rate: entry.rate3 },
        ].map((s) =>
          s.sale || s.rate ? (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-50 text-[9px] font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                {s.id}
              </span>
              <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-300">
                {Number(s.sale).toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-300 dark:text-gray-600">
                @
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {s.rate}
              </span>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};

// ─── Mini Stat Cell (inside entry card) ──────────────────────────────────────
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

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination: FC<{
  currentPage: number;
  totalPage: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (n: number) => void;
}> = ({ currentPage, totalPage, onPrev, onNext, onGoto }) => {
  // show at most 5 page buttons, centred on current
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);
  let visible = pages;
  if (totalPage > 5) {
    const start = Math.max(0, Math.min(currentPage - 3, totalPage - 5));
    visible = pages.slice(start, start + 5);
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
      <PagBtn
        onClick={onPrev}
        disabled={currentPage === 1}
        aria-label="Previous"
      >
        <HiChevronLeft className="h-4 w-4" />
      </PagBtn>

      {visible[0]! > 1 && (
        <>
          <PagBtn onClick={() => onGoto(1)}>1</PagBtn>
          {visible[0]! > 2 && (
            <span className="px-1 text-sm text-gray-400">…</span>
          )}
        </>
      )}

      {visible.map((n) => (
        <PagBtn key={n} onClick={() => onGoto(n)} active={n === currentPage}>
          {n}
        </PagBtn>
      ))}

      {visible[visible.length - 1]! < totalPage && (
        <>
          {visible[visible.length - 1]! < totalPage - 1 && (
            <span className="px-1 text-sm text-gray-400">…</span>
          )}
          <PagBtn onClick={() => onGoto(totalPage)}>{totalPage}</PagBtn>
        </>
      )}

      <PagBtn
        onClick={onNext}
        disabled={currentPage === totalPage}
        aria-label="Next"
      >
        <HiChevronRight className="h-4 w-4" />
      </PagBtn>
    </div>
  );
};

const PagBtn: FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
> = ({ active, className = "", children, ...props }) => (
  <button
    {...props}
    className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl px-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
    } ${className}`}
  >
    {children}
  </button>
);

export default EntriesPage;
