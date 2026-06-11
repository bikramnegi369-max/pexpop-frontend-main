/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Table,
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiHome,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import 'react-calendar/dist/Calendar.css';
import dateFormat from "dateformat";
import { api } from "../../services/api";
import { useParams } from "react-router";
import EditEntryModal from "../../components/entries/edit-entry";
import SearchEntries from "../../components/entries/search-entries";
import DeleteEntryModal from "../../components/entries/delete-entry";
import AddEntryModal from "../../components/entries/add-entry";

const EntriesPage: FC = function () {
  const [entries, setEntries] = useState<any[]>([]);
  const [profit, setProfit] = useState<number>(0);
  const [revenue, setRevnue] = useState<number>(0);
  const [costing, setCosting] = useState<number>(0);
  const { date } = useParams();
  const formatedDate = dateFormat(date, "yyyy/mm/dd");
  console.log(formatedDate + "date");

  const getEntries = async () => {
    console.log("entreis")
    const res = await api.get(`/auth/entries-by-date?date=${formatedDate}`);
    if (res.data.status === 'success') {
      setEntries(res.data.dateRecord.entries);
      const total_sale_inr_for_date = res.data?.dateRecord?.entries?.reduce((a: number, b: any) => (a + b.total_sale_inr), 0);
      // const loss=res.data.data.reduce((a: any, b: any) =>b.profit<0?(a + b.profit):a, 0);
      const total_revenue = res.data?.dateRecord?.entries?.reduce((a: number, b: any) => (a + b.revenue), 0);
      setCosting(res.data.dateRecord?.costing_inr)
      setRevnue(total_sale_inr_for_date - res.data.dateRecord?.costing_inr);
      setProfit(total_revenue - res.data.dateRecord?.costing_inr);
    }
    else {
      ;
    }
  }
  useEffect(() => {
    getEntries();
  }, [])

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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl flex justify-between">
              Entries - {dateFormat(date, "dd mmm yyyy")}
              <div className="flex gap-4">
                <button type="button" className="focus:outline-none text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-green-800">Costing :{costing.toLocaleString("en-US")}</button>
                <button type="button" className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-green-800">Total Revenue : {revenue.toLocaleString("en-US")}</button>
                <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Net Profit : {profit.toLocaleString("en-US")}</button>
              </div>
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchEntries setEntries={setEntries} />

            <div className="flex w-full items-center sm:justify-end gap-4">

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













type ProductTableProps = {
  entries: any[],
  getEntries: any
}
const ProductsTable: FC<ProductTableProps> = function ({ entries, getEntries }: ProductTableProps) {


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
  }
  const goToPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

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
          <Table.HeadCell>Agent Commission (INR)</Table.HeadCell>
          <Table.HeadCell>Agent Payment Status</Table.HeadCell>
          <Table.HeadCell>Profit</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {currentItems.length > 0 && currentItems.map((entry: any) =>
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
                {entry.agent_commission_inr}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {entry.payment_status == "paid" ? <span className="px-3 py-1.5 bg-green-500 rounded-md text-sm text-white">Paid</span> : <span className="px-3 py-1.5 bg-red-500 text-sm rounded-md text-white">Pending</span>}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                {entry.revenue}
              </Table.Cell>
              <Table.Cell className="space-x-2 whitespace-nowrap p-4">
                <div className="flex items-center gap-x-3">
                  <EditEntryModal entry={entry} entryId={entry._id} getEntries={getEntries} />
                  <DeleteEntryModal entryId={entry._id} getEntries={getEntries} />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {currentItems.length === 0 && <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="text-base text-center font-semibold text-gray-900 dark:text-white">
                No Entries Found
              </div>
            </Table.Cell>
          </Table.Row>}


        </Table.Body>

      </Table>
      {currentItems.length > itemsPerPage && <div className="text-center gap-4 flex justify-center pb-5 pt-5">
        <button className="p-2 px-5 bg-primary-500 rounded-xl" onClick={() => goToPrev()}>
          Prev
        </button>
        {Array.from(Array(totalPage).keys()).map((index) =>
          <p className={`mt-2 cursor-pointer rounded-full px-3 flex justify-center items-center py-0.1 ${currentPage == index + 1 && "bg-primary-400"}`} onClick={() => setCurrentPage(index + 1)}>{index + 1}</p>)}
        <button className="p-2 px-5 bg-primary-500 rounded-xl" onClick={() => goToNext()}>
          Next
        </button>
      </div>}
    </>
  );
};

export default EntriesPage;
