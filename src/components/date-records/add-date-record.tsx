import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import Calendar from "react-calendar";
import { toast } from "react-toastify";
import { api } from "../../services/api";
import type { DateRecord } from "../../types/Date-Record";
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import dateFormat from "dateformat";
const AddDateModal = function ({ getDateRecords }: { getDateRecords: any }) {
  const [isOpen, setOpen] = useState(false);

  const { register, handleSubmit, setValue } = useForm<DateRecord>();

  const onSubmit = async (data: DateRecord) => {
    const res = await api.post("/auth/add-date", JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    if (res.data.status === "success") {
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOpen(false);
      getDateRecords();
    } else {
      toast.error(res.data.message, {
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
  const [isShowCalendar, setShowCalender] = useState(false);
  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add Date
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add Date</strong>
        </Modal.Header>
        <Modal.Body className="h-96 overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="col-span-2">
                <Label htmlFor="productName">Date</Label>
                <TextInput
                  {...register("date", { required: true })}
                  placeholder="2024/01/12"
                  className="mt-1 disabled:text-black"
                  onClick={() => setShowCalender(!isShowCalendar)}
                />
              </div>
              <div className="col-span-2">
                {isShowCalendar && (
                  <Calendar
                    className="absolute top-20 left-0 z-50"
                    onChange={(e) => {
                      e &&
                        setValue("date", dateFormat(e as Date, "yyyy/mm/dd"));
                      setShowCalender(false);
                    }}
                  />
                )}
                <Label className="mt-4">Costing</Label>
                <TextInput
                  {...register("costing_inr", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  placeholder="3500"
                  className="mt-1 disabled:text-black"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddDateModal;
