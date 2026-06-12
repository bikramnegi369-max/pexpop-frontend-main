/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Modal, Table } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

import "react-calendar/dist/Calendar.css";
import dateFormat from "dateformat";

import Calendar from "react-calendar";
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import { api } from "../../../services/api";
import DeleteEntryModal from "../../entries/delete-entry";
import AddEntryModal from "../../entries/add-entry";
import EditEntryModal from "../../entries/edit-entry";
import SearchEntries from "../../entries/search-entries";

const AllMangerEntry: FC = function () {
  const [entries, setEntries] = useState<any[]>([]);
  const getEntries = async () => {
    const res = await api.get("/auth/all-entry");
    if (res.data.status === "success") {
      setEntries(res.data.data);
    } else {
      toast.success("Something Went Wrong", {
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
  useEffect(() => {
    getEntries();
  }, []);

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
                Entries
              </Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All Entries
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchEntries setEntries={setEntries} />

            <div className="flex w-full items-center gap-4 sm:justify-end">
              <EntryByDateModal />
              <AddEntryModal getEntries={getEntries} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <ProductsTable entries={entries} getEntries={getEntries} />
            </div>
          </div>
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
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Select Date
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Select Date</strong>
        </Modal.Header>
        <Modal.Body className="h-96 overflow-auto">
          <Calendar onChange={(e) => handleDate(e)} className="h-full w-full" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpen(!isOpen)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

interface ProductTableProps {
  entries: any[];
  getEntries: any;
}
const ProductsTable: FC<ProductTableProps> = function ({
  entries,
  getEntries,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPage = Math.ceil(entries.length / itemsPerPage);

  const goToNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          {/* <Table.HeadCell>
            <span className="sr-only">Toggle selected</span>
            <Checkbox />
          </Table.HeadCell> */}

          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Sale 1</Table.HeadCell>
          <Table.HeadCell>Rate 1</Table.HeadCell>
          <Table.HeadCell>Sale 2</Table.HeadCell>
          <Table.HeadCell>Rate 2</Table.HeadCell>
          <Table.HeadCell>Sale 3</Table.HeadCell>
          <Table.HeadCell>Rate 3</Table.HeadCell>
          <Table.HeadCell>Total Sale (USD)</Table.HeadCell>
          <Table.HeadCell>Total Sale (INR)</Table.HeadCell>
          <Table.HeadCell>Agent Commission</Table.HeadCell>
          <Table.HeadCell>Costing</Table.HeadCell>
          <Table.HeadCell>Profit</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {currentItems.length > 0 &&
            currentItems.map((entry: any) => (
              <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
                {/* <Table.Cell>
                <Checkbox />
              </Table.Cell> */}
                <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                  <div className="text-base font-semibold text-gray-900 dark:text-white">
                    {dateFormat(entry.date, "dd mmm yyyy")}
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.sale1}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.rate1}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.sale2}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.rate2}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.sale3}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.rate3}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.total_sale_usd}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.total_sale_inr}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.agent_commission}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.costing_inr}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {entry.profit}
                </Table.Cell>
                <Table.Cell className="space-x-2 whitespace-nowrap p-4">
                  <div className="flex items-center gap-x-3">
                    <EditEntryModal
                      entry={entry}
                      entryId={entry._id}
                      getEntries={getEntries}
                    />
                    <DeleteEntryModal
                      entryId={entry?._id}
                      getEntries={getEntries}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="flex justify-center gap-4 py-5 text-center">
        <button
          className="rounded-xl bg-primary-200 p-2 px-5"
          onClick={() => goToPrev()}
        >
          back
        </button>
        {Array.from(Array(totalPage).keys()).map((index) => (
          <p
            className={`py-0.1 mt-2 flex cursor-pointer items-center justify-center rounded-full px-3 ${
              currentPage == index + 1 && "bg-primary-400"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </p>
        ))}
        <button
          className="rounded-xl bg-green-200 p-2 px-5"
          onClick={() => goToNext()}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AllMangerEntry;
