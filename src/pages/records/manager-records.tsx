/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  HiHome,
  HiArrowRight,
  HiOutlineArchive,
  HiCurrencyDollar,
  HiCash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import "react-calendar/dist/Calendar.css";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import AddManagerDateModal from "../../components/date-records/add-managerDate-record";
import EditManagerDateModal from "../../components/date-records/edit-managerData-record";
import DeleteManagerDateModal from "../../components/date-records/delete-Managerdate-record";
import DateRangeFilter from "../../components/DateRangeFilter";

const AllManagerEntriesPage: FC = function () {
  const [dateRecords, setDateRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [selectionRange, setSelectionRange] = useState({
    startDate: firstDay,
    endDate: lastDay,
    key: "selection",
  });

  const getDateRecords = useCallback(async () => {
    setLoading(true);
    const res = await api.get("/manager/all-date");
    if (res.data.status === "success") {
      setDateRecords(res.data.data);
    }
    setLoading(false);
  }, []);

  const totals = dateRecords.reduce(
    (acc, curr) => ({
      saleUsd: acc.saleUsd + (Number(curr.total_sale_usd) || 0),
      saleInr: acc.saleInr + (Number(curr.total_sale_inr) || 0),
      costing: acc.costing + (Number(curr.costing_inr) || 0),
    }),
    { saleUsd: 0, saleInr: 0, costing: 0 },
  );

  const getDateRecordsByDateRange = useCallback(async () => {
    setLoading(true);
    const from = dateFormat(selectionRange.startDate, "yyyy-mm-dd");
    const to = dateFormat(selectionRange.endDate, "yyyy-mm-dd");
    const res = await api.get(
      `/manager/date-by-date-range/?from=${from}&to=${to}`,
    );
    setDateRecords(res.data.status === "success" ? res.data.data : []);
    setLoading(false);
  }, [selectionRange.startDate, selectionRange.endDate]);

  const navigate = useNavigate();

  useEffect(() => {
    getDateRecordsByDateRange();
  }, [getDateRecordsByDateRange]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="mx-auto w-full max-w-[1440px] space-y-8 p-4 sm:p-6 lg:p-8">
        {/* ── Header Section ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Link
                to="/auth/manager-dashboard"
                className="flex items-center transition-all hover:text-blue-600"
              >
                <HiHome className="mr-1 h-3.5 w-3.5" /> Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-600 dark:text-gray-400">
                Manager Records
              </span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Manager Records
            </h1>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <DateRangeFilter
              value={selectionRange}
              onChange={setSelectionRange}
            />
            <AddManagerDateModal getDateRecords={getDateRecords} />
          </div>
        </div>

        {/* Summary Header for Managers */}
        {!loading && dateRecords.length > 0 && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-blue-100 bg-blue-50/30 p-5 dark:border-blue-900/20 dark:bg-blue-900/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                Total Sale (USD)
              </p>
              <p className="mt-1 text-2xl font-black text-blue-700 dark:text-blue-400">
                ${totals.saleUsd.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-5 dark:border-white/5 dark:bg-gray-800/40">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total Sale (INR)
              </p>
              <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                ₹{totals.saleInr.toLocaleString()}
              </p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-5 dark:border-white/5 dark:bg-gray-800/40 col-span-2 lg:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total Costing
              </p>
              <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
                ₹{totals.costing.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
                className="group relative overflow-hidden rounded-[2rem] border border-gray-200/60 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-xl dark:border-white/5 dark:bg-gray-800/50 dark:backdrop-blur-sm"
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 transition-colors ${
                    record.total_pending_entries > 0
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                />
                <div className="flex flex-col gap-6 p-5 pl-8 md:p-6 md:pl-10 lg:flex-row lg:items-center lg:justify-between">
                  <div className="lg:w-36 xl:w-48">
                    <p className="text-sm font-black text-gray-900 dark:text-white md:text-lg lg:text-base xl:text-lg">
                      {dateFormat(record.date, "dd mmm yyyy")}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          record.total_pending_entries > 0
                            ? "animate-pulse bg-red-500"
                            : "bg-green-500"
                        }`}
                      />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {record.total_entries}{" "}
                        {record.total_entries === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
                    <StatCell
                      label="Sale (USD)"
                      value={`$${Number(
                        record.total_sale_usd,
                      ).toLocaleString()}`}
                      icon={<HiCurrencyDollar className="h-3.5 w-3.5" />}
                    />
                    <StatCell
                      label="Sale (INR)"
                      value={`₹${Number(
                        record.total_sale_inr,
                      ).toLocaleString()}`}
                      icon={<HiCash className="h-3.5 w-3.5" />}
                    />
                    <StatCell
                      label="Costing"
                      value={`₹${Number(record.costing_inr).toLocaleString()}`}
                      icon={<HiOutlineArchive className="h-3.5 w-3.5" />}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-4 lg:ml-6 lg:border-0 lg:pt-0">
                    <button
                      onClick={() =>
                        navigate(
                          `/managerEntries-by-date/${dateFormat(
                            record.date,
                            "dd-mmm-yyyy",
                          )}`,
                        )
                      }
                      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95 sm:flex-none xl:px-8"
                    >
                      Entries <HiArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <EditManagerDateModal
                      dateRecord={record}
                      dateRecordId={record.id}
                      getDateRecords={getDateRecords}
                    />
                    <DeleteManagerDateModal
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
  icon?: React.ReactNode;
}> = ({ label, value, icon }) => {
  return (
    <div className="rounded-xl bg-gray-50/50 p-3 ring-1 ring-inset ring-gray-100 transition-all dark:bg-gray-800/40 dark:ring-white/5 sm:p-4">
      <div className="flex items-center gap-1.5 mb-1">
        {icon && (
          <span className="text-gray-400 dark:text-gray-500">{icon}</span>
        )}
        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 sm:text-[9px]">
          {label}
        </p>
      </div>
      <p className="text-xs font-black tabular-nums tracking-tight text-gray-900 dark:text-gray-100 sm:text-sm lg:text-base">
        {value}
      </p>
    </div>
  );
};

export default AllManagerEntriesPage;
