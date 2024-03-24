import { useState } from "react";
import Header from "./Header";
import SideNavbar from "./SideNavbar";
import { CiEdit } from "react-icons/ci";
import { IoIosSave } from "react-icons/io";
import { Link } from "react-router-dom";
function AddWorkOrder() {
  const [isEdit, setIsEdit] = useState(false);

  const handleIcon = () => {
    setIsEdit((prev) => !prev);
  };
  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">New Work Orders</h1>
            <div className="flex gap-3">
              <Link to={"/workorder"}>
                <button className="border border-gray-400 text-gray-400 px-6 py-2 rounded">
                  Cancel
                </button>
              </Link>

              <button className="bg-red-500 text-white px-6 py-2 rounded">
                Save
              </button>
            </div>
          </div>
          <div className="flex gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex gap-2 text-xl font-normal flex-col w-[50%]">
              <label>Select a client</label>
              <input className="border border-grey-200 py-2 px-4 bg-gray-200 rounded h-10 text-sm " />
            </div>

            <div className="flex gap-2 text-xl font-normal flex-col w-[50%]">
              <label>Work order ticket</label>
              <input className="border border-grey-200 py-2 px-4 bg-gray-200 rounded h-10 text-sm " />
            </div>
          </div>

          {/* Work Order Ticket */}

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="text-xl font-normal mb-2">Work Order Ticket</h1>

              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Client name</label>
                <input
                  type="date"
                  className="px-3 py-3 border bg-gray-200 border-gray-200  h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Client site</label>
                <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                  <option>Select Status</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Work order type</label>
                <input
                  type="date"
                  className="px-3 py-3 border bg-gray-200 border-gray-200  h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Enter Po number</label>
                <input className="px-3 py-3 border  border-gray-200  h-10 text-sm rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Contract</label>
                <input
                  type="date"
                  className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Address</label>
                <input
                  type="date"
                  className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Job location (optional)
                </label>
                <input className="px-3 py-3 border border-gray-200  h-10 text-sm rounded"></input>
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Contact person</label>
                <input className="px-3 py-3 border border-gray-200 bg-gray-200 h-10 text-sm rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Contact phone number
                </label>

                <div className="flex flex-row gap-1">
                  <select className="px-3 border bg-gray-200 border-gray-200 h-10 text-sm rounded">
                    <option value="">+1</option>
                  </select>
                  <input
                    type="text"
                    className="px-3 py-3 border bg-gray-200 border-gray-200 h-10 text-sm rounded w-[100%]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Contact E-mail id
                </label>
                <input className="px-3 py-3 border border-gray-200 bg-gray-200 h-10 text-sm rounded"></input>
              </div>
            </div>
          </div>

          {/* Assign Technicain  */}

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="text-xl font-normal mb-2">Assign Technicain</h1>

              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Generated date</label>
                <input
                  type="date"
                  className="px-3 py-3 border bg-gray-100 border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Generated time</label>
                <input className="px-3 py-3 border border-gray-200 bg-gray-100 h-10 text-sm rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Status</label>
                <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                  <option>Select Status</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                Assign technician{" "}
                <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                  <option>Select Assign</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Select service date
                </label>
                <input
                  type="date"
                  className="px-3 py-3 border bg-gray-100 border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Appointment date
                </label>
                <input
                  type="date"
                  className="px-3 py-3 border bg-gray-100 border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Requested by</label>
                <input className="px-3 py-3 border border-gray-200 bg-gray-100 h-10 text-sm rounded"></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Phone Number</label>

                <div className="flex flex-row gap-1">
                  <select
                    id="cellCountryCode"
                    className="px-3 border bg-gray-100 border-gray-200 h-10 text-sm rounded"
                  >
                    <option value="">+1</option>
                  </select>
                  <input
                    type="text"
                    className="px-3 py-3 border bg-gray-100 border-gray-200 h-10 text-sm rounded w-[100%]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Procedures</label>
                <input
                  placeholder="Choose project manager"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Service request</label>
                <textarea
                  className="px-3 py-3 border text-sm border-gray-200 resize-none rounded"
                  placeholder="Type"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Other details</label>
                <textarea
                  className="px-3 py-3 border text-sm border-gray-200 resize-none rounded"
                  placeholder="Type"
                ></textarea>
              </div>
            </div>
          </div>

          {/* notes */}
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="font-normal text-xl mb-2">Notes</h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">Parts</label>
              <textarea
                className="px-3 py-3 border  text-sm border-gray-200 resize-none rounded"
                placeholder="Choose project manager"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">
                Labeling methodology
              </label>
              <textarea
                className="px-3 py-3 border text-sm border-gray-200 resize-none rounded"
                placeholder="Type"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">
                Equipment installation notes
              </label>
              <textarea
                className="px-3 py-3 border text-sm border-gray-200 resize-none rounded"
                placeholder="Choose project manager"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">
                Required deliverables
              </label>
              <textarea
                className="px-3 py-3 border text-sm border-gray-200 resize-none rounded"
                placeholder="Type"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">
                Deliverable instructions
              </label>
              <textarea
                className="px-3 py-3 border text-sm border-gray-200 resize-none rounded"
                placeholder="Type"
              ></textarea>
            </div>
          </div>

          {/* add new */}
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-end">
              <button className="bg-red-600 text-sm font-normal rounded px-3 py-2 text-white">
                Add New
              </button>
            </div>
            <table className="mt-2 w-[100%]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Date
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Time
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Serial number
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Technician name
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Notes
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Internal notes
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className=" text-xs py-3">19/12/2023</td>
                  <td className="text-xs py-3">05:00 PM</td>
                  <td className="text-xs py-3">1</td>
                  <td className="text-xs py-3">Technician 1</td>
                  <td className="text-xs py-3">
                    Test note for project work order as manager
                  </td>
                  <td className="text-xs py-3">
                    Test note for project work order as manager
                  </td>
                  <td
                    className="flex items-center justify-center py-3"
                    onClick={handleIcon}
                  >
                    <div className="p-[4px] bg-gray-100 cursor-pointer text-center">
                      {isEdit ? <IoIosSave /> : <CiEdit />}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddWorkOrder;
