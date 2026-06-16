/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";
import {
  HiHome,
  HiCash,
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
import EditManagerEntryModal from "../../components/entries/edit-manger-entry";
import DeleteManagerEntryModal from "../../components/entries/delete-Managerentry";
import AddManagerEntryModal from "../../components/entries/add-Managerentry";
import SearchManagerEntries from "../../components/entries/search-Managerentries";
import { Link, useParams } from "react-router-dom";

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

const ManagerEntriesPage: FC = function () {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsd: 0,
    totalInr: 0,
    costing: 0,
  });

  const { date } = useParams();
  const formatedDate = dateFormat(date || "", "yyyy/mm/dd");

  const getEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/manager/entries-by-date?date=${formatedDate}`
      );
      if (res.data.status === "success") {
        const entryList = res.data.dateRecord?.entries || [];
        setEntries(entryList);
        setStats({
          totalUsd: entryList.reduce(
            (a: number, b: any) => a + (Number(b.total_sale_usd) || 0),
            0
          ),
          totalInr: entryList.reduce(
            (a: number, b: any) => a + (Number(b.total_sale_inr) || 0),
            0
          ),
          costing: Number(res.data.dateRecord?.costing_inr) || 0,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [formatedDate]);

  useEffect(() => {
    getEntries();
  }, [getEntries]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="mx-auto w-full max-w-screen-xl px-3 py-4 sm:px-5 sm:py-6 lg:p-8">
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 sm:mb-5">
          <Link
            to="/auth/manager-dashboard"
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <HiHome className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span>/</span>
          <Link
            to="/all-manager"
            className="rounded-md px-1.5 py-0.5 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700"
          >
            Manager Records
          </Link>
          <span>/</span>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Entries
          </span>
        </nav>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <HiCalendar className="h-5 w-5 shrink-0 text-blue-500" />
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">
                Manager Entries - {dateFormat(date, "dd mmm yyyy")}
              </h1>
            </div>
            <p className="pl-7 text-sm text-gray-400 dark:text-gray-500">
              {loading ? "Loading..." : `${entries.length} entries recorded`}
            </p>
          </div>
          <AddManagerEntryModal getEntries={getEntries} />
        </div>

        {/* ── Stats ─────────────────────────────────────────────────── */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3">
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
            color="yellow"
          />
          <StatCard
            label="Total Costing"
            value={stats.costing}
            prefix="₹"
            icon={<HiOutlineArchive />}
            color="red"
          />
        </div>

        {/* ── Search ─────────────────────────────────────────────────── */}
        <div className="mb-5 rounded-2xl border border-gray-200/70 bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:mb-6">
          <SearchManagerEntries setEntries={setEntries} />
        </div>

        {/* ── List ───────────────────────────────────────────────────── */}
        <ManagerEntriesList
          entries={entries}
          getEntries={getEntries}
          loading={loading}
        />
      </div>
    </NavbarSidebarLayout>
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
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 ${c.bg}`}
        >
          <span className={`h-4 w-4 sm:h-5 sm:w-5 ${c.text}`}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 sm:text-[10px]">
            {label}
          </p>
          <div className="flex flex-wrap items-baseline gap-x-0.5">
            <span className={`text-xs font-bold opacity-70 ${c.text}`}>
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

const ManagerEntriesList: FC<{
  entries: any[];
  getEntries: () => void;
  loading: boolean;
}> = ({ entries, getEntries, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPage = Math.ceil(entries.length / itemsPerPage);
  const currentItems = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-700/60"
          />
        ))}
      </div>
    );
  if (entries.length === 0)
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 dark:border-white/10 dark:bg-gray-800/50">
        <HiOutlineArchive className="mb-2 h-10 w-10 text-gray-200" />
        <p className="text-gray-400">No entries found</p>
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        {currentItems.map((entry) => (
          <ManagerEntryCard
            key={entry._id}
            entry={entry}
            getEntries={getEntries}
          />
        ))}
      </div>
      {totalPage > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="rounded-lg bg-white px-4 py-2 text-sm shadow transition-colors hover:bg-gray-50 dark:border dark:border-white/5 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
            className="rounded-lg bg-white px-4 py-2 text-sm shadow transition-colors hover:bg-gray-50 dark:border dark:border-white/5 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

const ManagerEntryCard: FC<{ entry: any; getEntries: () => void }> = ({
  entry,
  getEntries,
}) => {
  const isPaid = entry.payment_status === "paid";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-gray-800/50 dark:backdrop-blur-sm">
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          isPaid ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-500/10">
            <HiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {entry.name}
            </p>
            <Badge color={isPaid ? "success" : "failure"} className="mt-1">
              {entry.payment_status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <EditManagerEntryModal
            entry={entry}
            entryId={entry._id}
            getEntries={getEntries}
          />
          <DeleteManagerEntryModal
            entryId={entry._id}
            getEntries={getEntries}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-gray-700/30">
          <p className="text-[10px] font-bold text-gray-400">SALE (USD)</p>
          <p className="text-sm font-bold">
            ${Number(entry.total_sale_usd).toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl bg-gray-50 p-2.5 dark:bg-gray-700/30">
          <p className="text-[10px] font-bold text-gray-400">SALE (INR)</p>
          <p className="text-sm font-bold">
            ₹{Number(entry.total_sale_inr).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerEntriesPage;
