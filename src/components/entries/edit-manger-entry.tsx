import { useState } from "react";
import type EntryInputs from "../../types/Entry";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { HiPencilAlt } from "react-icons/hi";
import { toast } from "react-toastify";
const EditManagerEntryModal = function ({
  entry,
  entryId,
  getEntries,
}: {
  entry: EntryInputs;
  entryId: string;
  getEntries: any;
}) {
  const [isOpen, setOpen] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<EntryInputs>({ defaultValues: entry });

  //form Submit handler
  const onSubmit = async (data: EntryInputs) => {
    console.log(JSON.stringify(data) + "data");
    const res = await api.put(
      `/manager/update-entry/${entryId}`,
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } }
    );
    if (res.data.status == "success") {
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
      getEntries();
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
  return (
    <>
      <Button
        size="sm"
        color="light"
        onClick={() => setOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border-gray-200 bg-white p-0 shadow-sm transition-all hover:bg-gray-50 hover:text-blue-600 dark:border-white/10 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400 sm:w-auto sm:px-3"
      >
        <HiPencilAlt className="h-4 w-4 sm:mr-2" />
        <span className="hidden text-[10px] font-bold uppercase tracking-widest sm:inline">
          Edit
        </span>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit Manager Entry</strong>
        </Modal.Header>
        <Modal.Body className="h-96 overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="col-span-2">
                <Label htmlFor="productName">Name</Label>
                <TextInput
                  {...register("name", { required: true })}
                  placeholder='Apple iMac 27"'
                  className="mt-1 "
                />
                {errors.name && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>

              <div>
                <Label htmlFor="brand">Sale 1</Label>
                <TextInput
                  id="brand"
                  type="number"
                  placeholder="$2300"
                  {...register("sale1", { valueAsNumber: true })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Rate 1</Label>
                <TextInput
                  id="price"
                  type="number"
                  {...register("rate1", { valueAsNumber: true })}
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Sale 2</Label>
                <TextInput
                  id="brand"
                  type="number"
                  {...register("sale2", { valueAsNumber: true })}
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Rate 2</Label>
                <TextInput
                  id="price"
                  {...register("rate2", { valueAsNumber: true })}
                  type="number"
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Sale 3</Label>
                <TextInput
                  id="brand"
                  type="number"
                  {...register("sale3", { valueAsNumber: true })}
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Rate 3</Label>
                <TextInput
                  id="price"
                  type="number"
                  {...register("rate3", { valueAsNumber: true })}
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              {/* <div>
                  <Label htmlFor="brand">Total Sale (USD)</Label>
                  <TextInput
                    id="brand"
                    type="number"
                    {...register("total_sale_usd", { required: true})}
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Total Sale (INR)</Label>
                  <TextInput
                    id="price"
                    {...register("total_sale_inr", { required: true})}
                    type="number"
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div> */}
              {/* <div>
                  <Label htmlFor="brand">Agent Commission (%)</Label>
                  <TextInput
                    id="brand"
                    type="number"
                    {...register("agent_commission", { required:true,valueAsNumber: true})}
                    placeholder="13-15%"
                    className="mt-1"
                  />
                </div> */}
              <div>
                <Label htmlFor="payment_status">Agent Payment Status</Label>
                <Select
                  id="payment_status"
                  required
                  {...register("payment_status", { required: true })}
                >
                  <option disabled>Select Option</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </Select>
                {errors.payment_status && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit(onSubmit)}>Edit Entry</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditManagerEntryModal;
