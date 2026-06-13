/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button } from "flowbite-react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { HiHome, HiCalendar, HiArrowRight } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import "react-calendar/dist/Calendar.css";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { useNavigate } from "react-router";
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

  const getDateRecords = useCallback(async () => {
    setLoading(true);
    const res = await api.get("/manager/all-date");
    if (res.data.status === "success") {
      setDateRecords(res.data.data);
    }
    setLoading(false);
  }, []);

  const getDateRecordsByDateRange = useCallback(async () => {
    setLoading(true);
    const from = dateFormat(selectionRange.startDate, "yyyy-mm-dd");
    const to = dateFormat(selectionRange.endDate, "yyyy-mm-dd");
    const res = await api.get(
      `/manager/date-by-date-range/?from=${from}&to=${to}`,
    );
    setDateRecords(res.data.status === "success" ? res.data.data : []);
    setLoading(false);
  }, [selectionRange]);

  const navigate = useNavigate();
  const [selectionRange, setSelectionRange] = useState({
    startDate: firstDay,
    endDate: lastDay,
    key: "selection",
  });

  useEffect(() => {
    getDateRecordsByDateRange();
  }, [getDateRecordsByDateRange]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="w-full space-y-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Breadcrumb className="mb-2">
              <Breadcrumb.Item href="#">
                <HiHome className="mr-2" />
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item>Manager Records</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Manager Records
            </h1>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <DateRangeFilter
              value={selectionRange}
              onChange={setSelectionRange}
            />
            <AddManagerDateModal getDateRecords={getDateRecords} />
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
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
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    record.total_pending_entries > 0
                      ? "bg-red-400"
                      : "bg-green-400"
                  }`}
                />
                <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:p-5 sm:pl-6">
                  <div className="min-w-[130px]">
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {dateFormat(record.date, "dd mmm yyyy")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {record.total_entries} entries
                    </p>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                    <StatCell
                      label="Sale (USD)"
                      value={`$ ${record.total_sale_usd.toLocaleString()}`}
                    />
                    <StatCell
                      label="Sale (INR)"
                      value={`₹ ${record.total_sale_inr.toLocaleString()}`}
                    />
                    <StatCell
                      label="Costing"
                      value={`₹ ${record.costing_inr.toLocaleString()}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/managerEntries-by-date/${dateFormat(
                            record.date,
                            "dd-mmm-yyyy",
                          )}`,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-95"
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

const StatCell: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-700/50">
    <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
      {label}
    </p>
    <p className="mt-0.5 text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value}
    </p>
  </div>
);

export default AllManagerEntriesPage;
