import { useState } from "react";
import { api } from "../../services/api";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";

const DeleteDateModal = function ({
  dateRecordId,
  getDateRecords,
}: {
  dateRecordId: any;
  getDateRecords: any;
}) {
  const [isOpen, setOpen] = useState(false);
  const deleteDateRecord = async () => {
    const res = await api.delete(`/auth/delete-date/${dateRecordId}`);
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

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className=" text-lg" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pt-3 pb-0">
          <span className="sr-only">Delete product</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this product?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  setOpen(false);
                  deleteDateRecord();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default DeleteDateModal;
