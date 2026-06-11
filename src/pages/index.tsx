import { useState, type FC, useEffect } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { api } from "../services/api";
import dateFormat from "dateformat";
import { DateRangePicker } from 'react-date-range';
import { Label, TextInput } from "flowbite-react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
// import { Link } from "react-router-dom";
const DashboardPage: FC = function () {
  const [dateRecords, setDateRecords] = useState<any[]>([]);
  function getFirstAndLastDayOfMonth(year: number, month: number) {

    month--;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay)
    };
  }
  const today = new Date();
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth(today.getFullYear(), today.getMonth() + 1);
  const fetchDashboardDetails = async () => {
    const res = await api.get(`/auth/date-by-date-range/?from=${selectionRange.startDate}&to=${selectionRange.endDate}`);
    if (res.data.status === 'success') {
      setDateRecords(res.data.data);
    }
    else {
      setDateRecords([]);
    }
  }
  const [showDateRangeFilter, setShowDateRangeFilter] = useState(false)
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(firstDay),
    endDate: new Date(lastDay),
    key: 'selection',
  })
  useEffect(() => {
    fetchDashboardDetails();
  }, [selectionRange.startDate, selectionRange.endDate])
  const totalUSD = dateRecords.length > 0 ? dateRecords.reduce((total, dateRecord) => total + dateRecord.total_sale_usd, 0) : 0;
  const totalINR = dateRecords.length > 0 ? dateRecords.reduce((total, dateRecord) => total + dateRecord.total_sale_inr, 0) : 0;
  const totalCosting = dateRecords.length > 0 ? dateRecords.reduce((total, dateRecord) => total + dateRecord.costing_inr, 0) : 0;
  const totalProfit = dateRecords.length > 0 ? dateRecords.reduce((total, dateRecord) => total + dateRecord.total_profit, 0) : 0;
  const totalAgentCommission = dateRecords.length > 0 ? dateRecords.reduce((total, dateRecord) => total + dateRecord.total_agent_commission, 0) : 0;


  return (
    <NavbarSidebarLayout>

      <div className="mt-12 px-12 ">
        <h1 className="text-3xl font-bold mb-4">Filters</h1>

        <div className="flex items-center w-full gap-16 mt-4">
          {/* <div className="flex flex-col gap-2">
  <Label htmlFor="brand">By Date</Label>
                  <TextInput
                   
                    type="string"
                    onFocus={()=>setShowDateFilter(true)}
                    placeholder="01-Jan-2024"
                    className="mt-1 w-96"/>
                   {showDateFilter&& <Calendar className="absolute z-10 top-48 shadow-3xl border-black border"/>}
                  
  </div> */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="brand">By Date Range</Label>
            <TextInput
              id="brand"
              type="string"
              onFocus={() => setShowDateRangeFilter(true)}
              placeholder="1-Jan-2024  31-Jan-2024"
              value={`${dateFormat(selectionRange.startDate, "dd/mmm/yyyy")}- ${dateFormat(selectionRange.endDate, "dd/mmm/yyyy")}`}
              className="mt-1 w-96" />
            {showDateRangeFilter && <DateRangePicker ranges={[selectionRange]} onChange={(e: any) => { setSelectionRange({ ...selectionRange, startDate: e.selection.startDate, endDate: e.selection.endDate }); setShowDateRangeFilter(false) }} className="absolute top-48 shadow-3xl border-black border" />}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mt-[50px] mx-[20px]">
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total sale(USD)</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-[40px]">$ {totalUSD}</p>
        </a>
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total sale(INR)</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-[40px]">₹ {totalINR}</p>
        </a>
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Costing</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-[40px]">₹ {totalCosting}</p>
        </a>
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Net Profit</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-[40px]">₹ {totalProfit}</p>
        </a>
        <a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Total Agent Commission</h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-center text-[40px]">₹ {totalAgentCommission}</p>
        </a>
      </div>
    </NavbarSidebarLayout>
  );
};
export default DashboardPage;