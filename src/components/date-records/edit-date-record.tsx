import { useState } from "react";
import { Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import type { DateRecord } from "../../types/Date-Record";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import { HiPencil, HiCalendar } from "react-icons/hi";
import Calendar from "react-calendar";
import dateFormat from "dateformat";
import "react-calendar/dist/Calendar.css";

const EditDateModal = function ({
  dateRecord,
  dateRecordId,
  getDateRecords,
}: {
  dateRecord: DateRecord;
  dateRecordId: string;
  getDateRecords: any;
}) {
  const [isOpen, setOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<DateRecord>({
    defaultValues: dateRecord,
  });
  const dateValue = watch("date");

  const onSubmit = async (data: DateRecord) => {
    const res = await api.put(
      `/auth/update-date/${dateRecordId}`,
      JSON.stringify(data),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.data.status === "success") {
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
      });
      setOpen(false);
      getDateRecords();
    } else {
      toast.error(res.data.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
        title="Edit"
      >
        <HiPencil className="h-4 w-4" />
      </button>

      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            Edit Date Record
          </span>
        </Modal.Header>
        <Modal.Body className="px-6 py-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Date field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <HiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register("date", { required: true })}
                  readOnly
                  onClick={() => setShowCalendar((v) => !v)}
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={dateValue || ""}
                />
              </div>
              {showCalendar && (
                <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-gray-600">
                  <Calendar
                    onChange={(e) => {
                      if (e) {
                        setValue("date", dateFormat(e as Date, "yyyy/mm/dd"));
                        setShowCalendar(false);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Costing field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Costing (INR)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-400">
                  ₹
                </span>
                <input
                  {...register("costing_inr", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-7 pr-4 text-sm text-gray-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-100 px-6 py-4 dark:border-gray-700">
          <div className="flex w-full gap-3">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditDateModal;
