import { useState } from "react";
import EntryInputs from "../../types/Entry";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import dateFormat from "dateformat";
import {
    Button,
    Label,
    Modal,
    Select,
    TextInput,
  } from "flowbite-react";
  import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router";
import { toast } from "react-toastify";
 const AddEntryModal= function ({getEntries}:{getEntries:()=>void}) {
    const {date}=useParams();
    const formatedDate=dateFormat(date, "yyyy/mm/dd");
    const [isOpen, setOpen] = useState(false);
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<EntryInputs>({defaultValues:{
      name:'',
    sale1:null,
    rate1:null,
    sale2:null,
    rate2:null,
    sale3:null,
    rate3:null,
    }});
  
    const onSubmit =async (data: EntryInputs) =>{
      console.log(data);
      const res=await api.post('/auth/add-entry',JSON.stringify({...data,date:formatedDate}),{headers:{'Content-Type':'application/json'}});
      if(res.data.status==='success'){
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
        getEntries();
        setOpen(false);
        
      }
      else{
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
        <Button color="primary" onClick={() => setOpen(!isOpen)}>
          <FaPlus className="mr-3 text-sm" />
          Add Entry
        </Button>
        <Modal onClose={() => setOpen(false)} show={isOpen}>
          <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
            <strong>Add Entry</strong>
          </Modal.Header>
          <Modal.Body className="h-96 overflow-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label htmlFor="productName">Name</Label>
                  <TextInput
                    id="productName"
                    {...register("name", { required: true})}
                    placeholder='Agent Name"'
                    className="mt-1 "
                  />
                   {errors.name && <span className="text-red-500">This field is required</span>}
                </div>
                
                <div>
                  <Label htmlFor="brand">Sale 1</Label>
                  <TextInput
                    id="brand"
                    type="number"
                    placeholder="$2300"
                    {...register("sale1", {valueAsNumber: true})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Rate 1</Label>
                  <TextInput
                    id="price"
                    type="number"
                    {...register("rate1", {valueAsNumber: true})}
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Sale 2</Label>
                  <TextInput
                    id="brand"
                    type="number"
                    {...register("sale2", {valueAsNumber: true})}
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Rate 2</Label>
                  <TextInput
                    id="price"
                    {...register("rate2", {valueAsNumber: true})}
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
                    {...register("sale3", {valueAsNumber: true})}
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Rate 3</Label>
                  <TextInput
                    id="price"
                    type="number"
                    {...register("rate3", {valueAsNumber: true})}
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div>
             
                <div>
                  <Label htmlFor="brand">Agent Commission (%)</Label>
                  <TextInput
                    id="brand"
                    type="number"
                    {...register("agent_commission", { required:true,valueAsNumber: true})}
                    placeholder="13-15%"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="payment_status">Agent Payment Status</Label>
                  <Select id="payment_status" required {...register("payment_status",{required:true})}>
                    <option disabled>Select Option</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </Select>
                  {errors.payment_status&&<span className="text-red-500">This field is required</span>}
                </div>
               
                {/* <div>
                  <Label htmlFor="price">Profit (INR)</Label>
                  <TextInput
                    {...register("profit", { required: true})}
                    type="number"
                    disabled={true}
                    placeholder="$2300"
                    className="mt-1"
                  />
                </div> */}
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
          <Button onClick={handleSubmit(onSubmit)}  >
              Add Entry
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  export default AddEntryModal