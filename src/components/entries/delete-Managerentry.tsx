import { useState } from "react";
import { api } from "../../services/api";
import {
    Button,
    Modal,
   
  } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import {  useParams } from "react-router";

const DeleteManagerEntryModal = function ({ entryId, getEntries }: { entryId: any, getEntries: any }) {
    const [isOpen, setOpen] = useState(false);
    const {date}=useParams();
    const deleteEntry = async () => {
      const res = await api.delete(`/manager/delete-entry/${entryId}`,{headers:{'Content-Type':'application/json'},data:JSON.stringify({date:date})});
  
      if (res.data.status === 'success') {
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        setOpen(false);
        getEntries();
      }
      else {
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }
    }
  
  
    return (
      <>
        <Button color="failure" onClick={() => setOpen(!isOpen)}>
          <HiTrash className="mr-2 text-lg" />
          Delete item
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
                <Button color="failure" onClick={() => { setOpen(false); deleteEntry() }}>
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
  export default DeleteManagerEntryModal