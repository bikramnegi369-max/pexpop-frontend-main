import { useState } from "react";
import { Modal } from "flowbite-react";
import { api } from "../../services/api";
import { HiTrash, HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";

const DeleteDateModal = function ({
  dateRecordId,
  getDateRecords,
}: {
  dateRecordId: any;
  getDateRecords: any;
}) {
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteDateRecord = async () => {
    setLoading(true);
    try {
      const res = await api.delete(`/auth/delete-date/${dateRecordId}`);
      if (res.data.status === "success") {
        toast.success(res.data.message, { position: "top-center", autoClose: 2000 });
        setOpen(false);
        getDateRecords();
      } else {
        toast.error(res.data.message, { position: "top-center", autoClose: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        title="Delete"
      >
        <HiTrash className="h-4 w-4" />
      </button>

      <Modal onClose={() => setOpen(false)} show={isOpen} size="sm">
        <Modal.Body className="px-6 py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
              <HiOutlineExclamationCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">Delete this record?</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
            </div>
            <div className="flex w-full gap-3 pt-1">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deleteDateRecord}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-95 disabled:opacity-60"
              >
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteDateModal;
