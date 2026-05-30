import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MdDesktopWindows,
  MdArrowBack,
  MdQrCode2,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getEquipmentReportById,
} from "../../actions/reportActions";

import {
  useDispatch,
} from "react-redux";

const EquipmentReportDetails = () => {
  const navigate =
    useNavigate();

  const dispatch =
    useDispatch();

  const {
    equipmentRreportId,
  } =
    useParams();

  const [
    reportDetails,
    setReportDetails,
  ] =
    useState(null);

  useEffect(() => {
    if (
      equipmentRreportId
    ) {
      dispatch(
        getEquipmentReportById(
          equipmentRreportId,
        ),
      )
        .then(
          (
            response,
          ) => {
            setReportDetails(
              response.data,
            );
          },
        )
        .catch(
          (
            error,
          ) => {
            console.error(
              "Error fetching report details:",
              error,
            );
          },
        );
    }
  }, [
    dispatch,
    equipmentRreportId,
  ]);

  const goBack =
    () => {
      navigate(-1);
    };

  const DetailCard =
    ({
      label,
      value,
    }) => (
      <div
        className="
          bg-gray-50
          border
          border-gray-100
          rounded-2xl
          p-4
        "
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
          {label}
        </p>

        <p className="text-sm font-medium text-[#1E1B4B] break-words">
          {value ||
            "NA"}
        </p>
      </div>
    );

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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              {/* LEFT */}
              <div className="flex items-center gap-3">

                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gradient-to-r
                   from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
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
                    Equipment Report Details
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    View detailed equipment report information
                  </p>
                </div>
              </div>

              {/* BACK BUTTON */}
              <button
                onClick={
                  goBack
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  text-sm
                  font-medium
                  hover:bg-gray-50
                  transition-all
                "
              >
                <MdArrowBack className="text-lg" />
                Back
              </button>
            </div>
          </div>

          {/* DETAILS CARD */}
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            {reportDetails ? (
              <div className="p-5">

                {/* SECTION TITLE */}
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Equipment Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Complete equipment report details and activity
                  </p>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                  <DetailCard
                    label="Assigned To"
                    value={
                      reportDetails
                        ?.equipments
                        ?.assigned_to
                    }
                  />

                  <DetailCard
                    label="Device Type"
                    value={
                      reportDetails
                        ?.equipments
                        ?.device_type
                    }
                  />

                  <DetailCard
                    label="Make"
                    value={
                      reportDetails
                        ?.equipments
                        ?.make
                    }
                  />

                  <DetailCard
                    label="Model"
                    value={
                      reportDetails
                        ?.equipments
                        ?.model
                    }
                  />

                  <DetailCard
                    label="Location Name"
                    value={
                      reportDetails
                        ?.equipments
                        ?.location_name
                    }
                  />

                  <DetailCard
                    label="Serial Number"
                    value={
                      reportDetails
                        ?.equipments
                        ?.serial_number
                    }
                  />

                  <DetailCard
                    label="MAC Address"
                    value={
                      reportDetails
                        ?.equipments
                        ?.mac_address
                    }
                  />

                  <DetailCard
                    label="Performed By"
                    value={
                      reportDetails?.performed_by
                    }
                  />

                  <DetailCard
                    label="Performed Action"
                    value={
                      reportDetails?.performed_action
                    }
                  />

                  {/* DESCRIPTION */}
                  <div className="md:col-span-2 xl:col-span-3">

                    <div
                      className="
                        bg-gray-50
                        border
                        border-gray-100
                        rounded-2xl
                        p-5
                      "
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                        Description
                      </p>

                      <p className="text-sm text-[#1E1B4B] leading-relaxed whitespace-pre-wrap">
                        {reportDetails
                          ?.equipments
                          ?.description ||
                          "NA"}
                      </p>
                    </div>
                  </div>

                  {/* QR CODE */}
                  <div className="md:col-span-2 xl:col-span-3">

                    <div
                      className="
                        bg-gradient-to-br
                        from-indigo-50
                        to-pink-50
                        border
                        border-indigo-100
                        rounded-3xl
                        p-6
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                      "
                    >
                      <div
                        className="
                          w-14
                          h-14
                          rounded-2xl
                          bg-white
                          shadow-sm
                          flex
                          items-center
                          justify-center
                          mb-4
                        "
                      >
                        <MdQrCode2 className="text-3xl text-indigo-600" />
                      </div>

                      <h3 className="text-lg font-semibold text-[#1E1B4B] mb-2">
                        Equipment QR Code
                      </h3>

                      <p className="text-sm text-gray-500 mb-5">
                        Scan to identify equipment information
                      </p>

                      <div
                        className="
                          bg-white
                          border
                          border-gray-200
                          rounded-3xl
                          p-4
                          shadow-sm
                        "
                      >
                        <img
                          src={`https://idr-app-images-bucket.s3.amazonaws.com/${reportDetails.equipments?.qr_image}`}
                          alt="QR Code"
                          className="w-40 h-40 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center">

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
                  Loading report details...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentReportDetails;