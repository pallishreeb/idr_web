import { useEffect } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  BiSolidShow,
} from "react-icons/bi";

import {
  MdDesktopWindows,
  MdSearch,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getEquipmentReportList,
} from "../../actions/reportActions";

import {
  useDispatch,
  useSelector,
} from "react-redux";

const EquipmentReport = () => {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    equipments,
    loading,
  } =
    useSelector(
      (state) =>
        state.report,
    );

  useEffect(() => {
    dispatch(
      getEquipmentReportList(),
    );
  }, [dispatch]);

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div
          className="
            flex-1
            p-4
            md:p-5
            overflow-x-hidden
          "
        >
          {/* PAGE HEADER */}
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-5
            "
          >
            {/* TOP BAR */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                >
                  <MdDesktopWindows className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Equipment Reports
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    View equipment usage and activity reports
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex gap-3">

                <Link to="/inventory-report">
                  <button
                    className="
                      px-4
                      py-2.5
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-pink-500
                      text-white
                      font-semibold
                      text-sm
                      shadow-sm
                      hover:shadow-md
                      transition-all
                    "
                  >
                    Inventory Reports
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* TABLE */}
            <div className="overflow-x-auto max-w-full">

              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">

                    {[
                      "Location",
                      "Assigned To",
                      "Serial Number",
                      "Device Type",
                      "Make",
                      "Model",
                      "Performed By",
                      "Created Date",
                      "Action Type",
                      "Action",
                    ].map(
                      (
                        heading,
                        index,
                      ) => (
                        <th
                          key={index}
                          className="
                            px-3
                            py-3
                            text-left
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-gray-500
                            border-b
                          "
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="py-16 text-center"
                      >
                        <div className="flex flex-col items-center">

                          <div
                            className="
                              w-12
                              h-12
                              border-4
                              border-indigo-200
                              border-t-indigo-600
                              rounded-full
                              animate-spin
                              mb-4
                            "
                          />

                          <p className="text-sm text-gray-500 font-medium">
                            Loading Equipment Reports...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : equipments?.data
                      ?.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="py-16 text-center"
                      >
                        <div className="flex flex-col items-center">

                          <div
                            className="
                              w-20
                              h-20
                              rounded-full
                              bg-gray-100
                              flex
                              items-center
                              justify-center
                              mb-4
                            "
                          >
                            <MdSearch className="text-4xl text-gray-400" />
                          </div>

                          <h3 className="text-base font-semibold text-[#1E1B4B]">
                            No Reports Found
                          </h3>

                          <p className="text-sm text-gray-500 mt-2">
                            Equipment reports will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    equipments?.data?.map(
                      (
                        equipment,
                        index,
                      ) => (
                        <tr
                          key={index}
                          className="
                            hover:bg-indigo-50/40
                            transition-all
                          "
                        >
                          {/* LOCATION */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment
                              ?.equipments
                              ?.location_name ||
                              "NA"}
                          </td>

                          {/* ASSIGNED TO */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment
                              ?.equipments
                              ?.assigned_to ||
                              "NA"}
                          </td>

                          {/* SERIAL NUMBER */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment
                              ?.equipments
                              ?.serial_number ||
                              "NA"}
                          </td>

                          {/* DEVICE TYPE */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment
                              ?.equipments
                              ?.device_type ||
                              "NA"}
                          </td>

                          {/* MAKE */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment
                              ?.equipments
                              ?.make ||
                              "NA"}
                          </td>

                          {/* MODEL */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment
                              ?.equipments
                              ?.model ||
                              "NA"}
                          </td>

                          {/* PERFORMED BY */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {equipment?.performed_by ||
                              "NA"}
                          </td>

                          {/* CREATED DATE */}
                          <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                            {new Date(
                              equipment?.created_at,
                            ).toLocaleString(
                              "en-US",
                              {
                                timeZone:
                                  "America/New_York",

                                year:
                                  "numeric",

                                month:
                                  "2-digit",

                                day:
                                  "2-digit",

                                hour:
                                  "2-digit",

                                minute:
                                  "2-digit",

                                hour12: true,
                              },
                            )}
                          </td>

                          {/* ACTION TYPE */}
                          <td className="px-3 py-3 border-b">
                            <span
                              className="
                                inline-flex
                                items-center
                                px-2.5
                                py-1
                                rounded-full
                                bg-green-50
                                text-green-700
                                text-[11px]
                                font-semibold
                                capitalize
                              "
                            >
                              {equipment?.performed_action ||
                                "NA"}
                            </span>
                          </td>

                          {/* ACTION */}
                          <td className="px-3 py-3 border-b">
                            <button
                              onClick={() =>
                                navigate(
                                  `/equipment-report/${equipment?.equipment_report_id}`,
                                )
                              }
                              className="
                                w-8
                                h-8
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                                hover:bg-blue-100
                                transition-all
                              "
                            >
                              <BiSolidShow className="text-base" />
                            </button>
                          </td>
                        </tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentReport;