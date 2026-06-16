/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Button, Modal, Table } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";
import {
  HiHome,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineArchive,
  HiCalendar,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import "react-calendar/dist/Calendar.css";
import dateFormat from "dateformat";
import { api } from "../../services/api";
import Calendar from "react-calendar";
import { useNavigate, Link } from "react-router-dom";
import AddEntryModal from "../../components/entries/add-entry";
import EditEntryModal from "../../components/entries/edit-entry";
import SearchEntries from "../../components/entries/search-entries";
import DeleteEntryModal from "../../components/entries/delete-entry";
import { toast } from "react-toastify";

const AllEntriesPage: FC = function () {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/all-entry");
      if (res.data.status === "success") {
        setEntries(res.data.data);
      } else {
        toast.error("Failed to load entries");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEntries();
  }, [getEntries]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-10">
        {/* ── Header Section ────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-400">
              <Link to="/" className="transition-colors hover:text-blue-600">
                <HiHome className="h-3.5 w-3.5" />
              </Link>
              <span>/</span>
              <span className="text-gray-600 dark:text-gray-400">
                All Records
              </span>
            </nav>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              All Entries
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <EntryByDateModal />
            <AddEntryModal getEntries={getEntries} />
          </div>
        </div>

        {/* ── Actions & Search ───────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="rounded-3xl border border-gray-200/60 bg-white p-2 shadow-sm dark:border-white/5 dark:bg-gray-800/50 dark:backdrop-blur-sm">
            <SearchEntries setEntries={setEntries} />
          </div>
          <ProductsTable
            entries={entries}
            getEntries={getEntries}
            loading={loading}
          />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

const EntryByDateModal: FC = function () {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);
  const handleDate = (e: any) => {
    navigate(`/entries-by-date/${dateFormat(e, "yyyy-mm-dd")}`);
  };
  return (
    <>
      <Button
        color="light"
        className="rounded-xl border-gray-200 font-bold dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        onClick={() => setOpen(!isOpen)}
      >
        <HiCalendar className="mr-2 h-4 w-4" />
        Select Date
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="lg">
        <Modal.Header className="border-b-0 p-6 dark:bg-gray-900">
          <span className="text-xl font-black">Jump to Date</span>
        </Modal.Header>
        <Modal.Body className="p-0 dark:bg-gray-900">
          <div className="flex justify-center pb-8 pt-2">
            <Calendar
              onChange={(e) => handleDate(e)}
              className="!border-0 !font-sans shadow-none"
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

interface ProductTableProps {
  entries: any[];
  getEntries: any;
  loading: boolean;
}
const ProductsTable: FC<ProductTableProps> = function ({
  entries,
  getEntries,
  loading,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPage = Math.ceil(entries.length / itemsPerPage);
  const currentItems = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700/50"
          />
        ))}
      </div>
    );
  if (entries.length === 0)
    return (
      <div className="py-20 text-center">
        <HiOutlineArchive className="mx-auto h-12 w-12 text-gray-200" />
        <p className="mt-2 text-gray-400">No records found</p>
      </div>
    );

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-gray-800/50">
        <Table hoverable className="min-w-full">
          <Table.Head className="bg-gray-50/50 text-xs uppercase tracking-widest dark:bg-gray-900/50">
            <Table.HeadCell className="py-5">Date</Table.HeadCell>
            <Table.HeadCell className="py-5">Name</Table.HeadCell>
            <Table.HeadCell className="py-5">Sale (USD)</Table.HeadCell>
            <Table.HeadCell className="py-5">Sale (INR)</Table.HeadCell>
            <Table.HeadCell>Comm.</Table.HeadCell>
            <Table.HeadCell>Profit</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-gray-100 dark:divide-white/5">
            {currentItems.map((entry) => (
              <Table.Row key={entry._id} className="group transition-colors">
                <Table.Cell className="whitespace-nowrap p-4 text-xs font-bold text-gray-900 dark:text-white md:px-6 md:py-5 md:text-sm">
                  {dateFormat(entry.date, "dd mmm yyyy")}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-xs font-medium text-gray-700 dark:text-gray-300 md:px-6 md:py-5 md:text-sm">
                  {entry.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-black tabular-nums text-blue-600 dark:text-blue-400 md:px-6 md:py-5 md:text-base">
                  ${Number(entry.total_sale_usd).toLocaleString()}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-sm font-black tabular-nums text-green-600 dark:text-green-400">
                  ₹{Number(entry.total_sale_inr).toLocaleString()}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap text-xs text-yellow-600">
                  {entry.agent_commission}%
                </Table.Cell>
                <Table.Cell
                  className={`whitespace-nowrap text-sm font-black tabular-nums ${
                    entry.profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{Number(entry.profit).toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={
                      entry.payment_status === "paid" ? "success" : "failure"
                    }
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] uppercase"
                  >
                    {entry.payment_status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <EditEntryModal
                      entry={entry}
                      entryId={entry._id}
                      getEntries={getEntries}
                    />
                    <DeleteEntryModal
                      entryId={entry._id}
                      getEntries={getEntries}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Modern Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:border-white/5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          <HiChevronLeft className="h-5 w-5" />
        </button>
        {Array.from(Array(totalPage).keys()).map((index) => (
          <button
            key={index}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
              currentPage === index + 1
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "border border-gray-100 bg-white text-gray-400 hover:bg-gray-50 dark:border-white/5 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPage}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-30 dark:border-white/5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          onClick={() => setCurrentPage((p) => Math.min(totalPage, p + 1))}
        >
          <HiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </>
  );
};

export default AllEntriesPage;
