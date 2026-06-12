import { useState, type FC, useEffect } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { api } from "../services/api";
import dateFormat from "dateformat";
import DateRangeFilter from "../components/DateRangeFilter";
import {
  HiTrendingUp,
  HiCurrencyDollar,
  HiCurrencyRupee,
  HiReceiptTax,
  HiUserGroup,
} from "react-icons/hi";

interface DateRecord {
  total_sale_usd: number;
  total_sale_inr: number;
  costing_inr: number;
  total_profit: number;
  total_agent_commission: number;
}

function getMonthRange(year: number, month: number) {
  const m = month - 1;
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  return {
    firstDay: fmt(new Date(year, m, 1)),
    lastDay: fmt(new Date(year, m + 1, 0)),
  };
}

const DashboardPage: FC = function () {
  const today = new Date();
  const { firstDay, lastDay } = getMonthRange(
    today.getFullYear(),
    today.getMonth() + 1
  );

  const [dateRecords, setDateRecords] = useState<DateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(firstDay),
    endDate: new Date(lastDay),
    key: "selection",
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const from = dateFormat(selectionRange.startDate, "yyyy-mm-dd");
        const to = dateFormat(selectionRange.endDate, "yyyy-mm-dd");
        const res = await api.get(
          `/auth/date-by-date-range/?from=${from}&to=${to}`
        );
        setDateRecords(res.data.status === "success" ? res.data.data : []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selectionRange.startDate, selectionRange.endDate]);

  const totals = dateRecords.reduce(
    (acc, curr) => ({
      usd: acc.usd + curr.total_sale_usd,
      inr: acc.inr + curr.total_sale_inr,
      costing: acc.costing + curr.costing_inr,
      profit: acc.profit + curr.total_profit,
      commission: acc.commission + curr.total_agent_commission,
    }),
    { usd: 0, inr: 0, costing: 0, profit: 0, commission: 0 }
  );

  return (
    <NavbarSidebarLayout>
      <div className="w-full space-y-6 p-4 sm:p-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Overview of your sales and commissions
            </p>
          </div>
          <DateRangeFilter
            value={selectionRange}
            onChange={setSelectionRange}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Sale (USD)"
            value={totals.usd}
            prefix="$"
            icon={<HiCurrencyDollar className="h-5 w-5" />}
            color="blue"
            loading={loading}
          />
          <StatCard
            title="Total Sale (INR)"
            value={totals.inr}
            prefix="₹"
            icon={<HiCurrencyRupee className="h-5 w-5" />}
            color="indigo"
            loading={loading}
          />
          <StatCard
            title="Total Costing"
            value={totals.costing}
            prefix="₹"
            icon={<HiReceiptTax className="h-5 w-5" />}
            color="orange"
            loading={loading}
          />
          <StatCard
            title="Net Profit"
            value={totals.profit}
            prefix="₹"
            icon={<HiTrendingUp className="h-5 w-5" />}
            color="green"
            loading={loading}
          />
          <StatCard
            title="Agent Commission"
            value={totals.commission}
            prefix="₹"
            icon={<HiUserGroup className="h-5 w-5" />}
            color="purple"
            loading={loading}
          />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const colorStyles = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
    bar: "bg-blue-500",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    text: "text-indigo-600 dark:text-indigo-400",
    bar: "bg-indigo-500",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    text: "text-green-600 dark:text-green-400",
    bar: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    text: "text-orange-600 dark:text-orange-400",
    bar: "bg-orange-500",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    text: "text-purple-600 dark:text-purple-400",
    bar: "bg-purple-500",
  },
};

const StatCard: FC<{
  title: string;
  value: number;
  prefix: string;
  icon: React.ReactNode;
  color: keyof typeof colorStyles;
  loading: boolean;
}> = ({ title, value, prefix, icon, color, loading }) => {
  const s = colorStyles[color];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800`}
    >
      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-1 w-full ${s.bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {title}
          </p>
          {loading ? (
            <div className="mt-2 h-8 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          ) : (
            <p className="mt-1.5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {prefix}&nbsp;{value.toLocaleString()}
            </p>
          )}
        </div>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.icon}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
};

export default DashboardPage;
