import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosSave } from "react-icons/io";
import { Link } from "react-router-dom";
import Header from "../../Components/Header";
// import SideNavbar from "../../Components/SideNavbar";
import save from "../../Images/save.png";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

function AddWorkOrder() {
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const handleNext = () => {
    setStep(step + 1);
  };

  console.log("step", step);

  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    // Your save logic here
    setShowModal(false);
  };

  const handleIcon = () => {
    setIsEdit((prev) => !prev);
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">New Work Orders</h1>
          </div>
          {/* <div className="flex gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex gap-2 text-xl font-normal flex-col w-[100%]">
              <label>Select a client</label>
              <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                <option>Choose Option</option>
              </select>
            </div>
          </div> */}

          {/* Generated ticket  */}
          {step === 1 && (
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <h1 className="text-xl font-normal mb-2">Generate Ticket</h1>

                <div className="border border-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Choose Client</label>
                  <select className="px-3  border border-gray-200  h-10 text-sm rounded">
                    <option>Choose Option</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Choose Location
                  </label>
                  <select className="px-3  border border-gray-200  h-10 text-sm rounded">
                    <option>Choose Option</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Client Name</label>
                  <input
                    type="text"
                    className="px-3 py-3 border  border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Work order type
                  </label>
                  <input
                    type="text"
                    className="px-3 py-3 border  border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Enter Po number
                  </label>
                  <input
                    placeholder="type"
                    className="px-3 py-3 border  border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Client site</label>
                  <input
                    type="text"
                    className="px-3 py-3 border  border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact person
                  </label>
                  <input
                    placeholder="type"
                    className="px-3 py-3 border border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact Phone Number
                  </label>

                  <input
                    type="text"
                    placeholder="type"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded w-[100%]"
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact Email id
                  </label>
                  <input
                    placeholder="type"
                    className="px-3 py-3 border border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Service date</label>
                  <input
                    type="date"
                    placeholder="type"
                    className="px-3 py-3 border border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Issue</label>
                  <input
                    type="date"
                    placeholder="type"
                    className="px-3 py-3 border border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Status</label>
                  <select className="px-3  border border-gray-200  h-10 text-sm rounded">
                    <option>Choose Option</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 justify-center mt-7 items-center">
                  <button
                    className="border bg-blue-600 w-[30%] py-2 text-white rounded"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* new assign tech */}
          {step === 2 && (
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <h1 className="text-xl font-normal mb-2">Assign Technicain</h1>

                <div className="border border-gray-200"></div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Technician name
                  </label>
                  <select className="px-3 border border-gray-200 h-10 text-sm rounded">
                    <option>Choose technicain</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Project manager
                  </label>
                  <select className="px-3 border border-gray-200 h-10 text-sm rounded">
                    <option>Choose project manager</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Service request
                  </label>
                  <select className="px-3 border border-gray-200 h-10 text-sm rounded">
                    <option>Choose service</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    className="px-3 py-3 border border-gray-200  h-10 text-sm rounded"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Other details</label>
                  <input
                    className="px-3 py-3 border text-sm border-gray-200 rounded"
                    placeholder="Type"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Procedures</label>
                  <input
                    className="px-3 py-3 border text-sm border-gray-200 rounded"
                    placeholder="Type"
                  ></input>
                </div>

                <div className="flex flex-col gap-2 justify-center mt-7 items-center">
                  <button
                    className="border bg-blue-600 w-[10%] py-2 text-white rounded"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* notes */}
          {step === 3 && (
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <h1 className="font-normal text-xl mb-2">Notes</h1>
                <div className="border border-gray-200"></div>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Parts</label>
                <input className="px-3 py-2 border  text-sm border-gray-200 rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Labeling Methodology
                </label>
                <input className="px-3 py-2 border  text-sm border-gray-200 rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Equipment Required
                </label>
                <input className="px-3 py-2 border  text-sm border-gray-200 rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Require Deliverables
                </label>
                <input className="px-3 py-2 border  text-sm border-gray-200 rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Deliverable Instructions
                </label>
                <input className="px-3 py-2 border  text-sm border-gray-200 rounded"></input>
              </div>

              <div className="flex flex-col gap-2 justify-center mt-7 items-center">
                <button className="border bg-blue-600 w-[10%] py-2 text-white rounded">
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col gap-2 bg-white p-8 rounded shadow-lg w-[20%] m-auto text-center">
            <p>Are you sure you want to save this information?</p>
            <div className="items-center flex justify-center">
              <img className="w-[30%]" src={save} alt="save image" />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className=" px-4 py-2 text-white bg-red-500 rounded"
                onClick={handleConfirmSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 text-black border bg-gray-300 border-gray-300 rounded"
                onClick={handleConfirmSave}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddWorkOrder;
