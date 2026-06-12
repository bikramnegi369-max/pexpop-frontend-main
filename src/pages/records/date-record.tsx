/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Label, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";

import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import "react-calendar/dist/Calendar.css";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import EditDateModal from "../../components/date-records/edit-date-record";
import DeleteDateModal from "../../components/date-records/delete-date-record";
import AddDateModal from "../../components/date-records/add-date-record";
import { DateRangePicker } from "react-date-range";
const AllEntriesPage: FC = function () {
  const [dateRecords, setDateRecords] = useState<any[]>([]);

  function getFirstAndLastDayOfMonth(year: number, month: number) {
    // Month in JavaScript is 0-indexed, so subtract 1 if necessary.
    month--;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    };
  }

  const today = new Date();
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth(
    today.getFullYear(),
    today.getMonth() + 1
  );
  const getDateRecords = async () => {
    const res = await api.get("/auth/all-date");
    if (res.data.status === "success") {
      setDateRecords(res.data.data);
    } else {
      toast.error("Date Record Already Exists", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const getDateRecordsByDateRange = async () => {
    const res = await api.get(
      `/auth/date-by-date-range/?from=${selectionRange.startDate}&to=${selectionRange.endDate}`
    );
    if (res.data.status === "success") {
      setDateRecords(res.data.data);
    } else {
      setDateRecords([]);
    }
  };
  const navigate = useNavigate();
  const [showDateRangeFilter, setShowDateRangeFilter] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(firstDay),
    endDate: new Date(lastDay),
    key: "selection",
  });
  useEffect(() => {
    getDateRecords();
  }, []);
  useEffect(() => {
    getDateRecordsByDateRange();
  }, [selectionRange.startDate, selectionRange.endDate]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/e-commerce/products">
                Date Records
              </Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Date Record
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <div className="relative flex flex-col gap-2">
              <Label htmlFor="brand">By Date Range</Label>
              <TextInput
                id="brand"
                type="string"
                onFocus={() => setShowDateRangeFilter(true)}
                placeholder="1-Jan-2024  31-Jan-2024"
                value={`${dateFormat(
                  selectionRange.startDate,
                  "dd/mmm/yyyy"
                )}- ${dateFormat(selectionRange.endDate, "dd/mmm/yyyy")}`}
                className="mt-1 w-96"
              />
              {showDateRangeFilter && (
                <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={(e: any) => {
                    setSelectionRange({
                      ...selectionRange,
                      startDate: e.selection.startDate,
                      endDate: e.selection.endDate,
                    });
                    setShowDateRangeFilter(false);
                  }}
                  className="shadow-3xl absolute top-20 !z-[100px] border border-black"
                />
              )}
            </div>

            <div className="flex w-full items-center gap-4 sm:justify-end">
              <AddDateModal getDateRecords={getDateRecords} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dateRecords.length > 0 &&
                      dateRecords.map((dateRecord: any) => (
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4">
                            {dateRecord?.total_pending_entries > 0 ? (
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  padding: "1px",
                                  backgroundColor: "red",
                                  borderRadius: "50px",
                                }}
                              ></div>
                            ) : (
                              <div
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  padding: "1px",
                                  backgroundColor: "green",
                                  borderRadius: "50px",
                                }}
                              ></div>
                            )}

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                {dateFormat(dateRecord.date, "dd mmm yyyy")}
                              </p>
                              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {dateRecord.total_entries} Entries
                              </p>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                                Total Sale (USD)
                              </p>
                              <p className="truncate text-base text-gray-500 dark:text-gray-400">
                                $ {dateRecord.total_sale_usd}
                              </p>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                                Total Sale (INR)
                              </p>
                              <p className="truncate text-base text-gray-500 dark:text-gray-400">
                                ₹ {dateRecord.total_sale_inr}
                              </p>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                                ₹ Costing (INR)
                              </p>
                              <p className="truncate text-base text-gray-500 dark:text-gray-400">
                                ₹ {dateRecord.costing_inr}
                              </p>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-gray-900 dark:text-white">
                                Total Profit
                              </p>
                              <p className="truncate text-base text-gray-500 dark:text-gray-400">
                                ₹ {dateRecord.total_profit}
                              </p>
                            </div>
                            <div className="inline-flex items-center gap-3 text-base font-semibold text-gray-900 dark:text-white">
                              <Button
                                color="success"
                                onClick={() =>
                                  navigate(
                                    `/entries-by-date/${dateFormat(
                                      dateRecord.date,
                                      "dd-mmm-yyyy"
                                    )}`
                                  )
                                }
                              >
                                {" "}
                                Go to Entries
                              </Button>
                              <EditDateModal
                                dateRecord={dateRecord}
                                dateRecordId={dateRecord.id}
                                getDateRecords={getDateRecords}
                              />
                              <DeleteDateModal
                                dateRecordId={dateRecord.id}
                                getDateRecords={getDateRecords}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    {dateRecords.length == 0 && (
                      <li className=" h-96 text-center">No Record Found</li>
                    )}
                  </ul>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default AllEntriesPage;
