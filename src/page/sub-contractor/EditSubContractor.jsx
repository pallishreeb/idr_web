/** @format */

import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useParams,
} from "react-router-dom";

import {
  MdBusiness,
  MdPerson,
  MdBuild,
  MdLocationOn,
  MdSecurity,
  MdUploadFile,
  MdChecklist,
  MdNotes,
  MdArrowForwardIos,
  MdVerified,
} from "react-icons/md";

import {
  getSubcontractorInfoById,
} from "../../actions/subContractorAction";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import AccordionSection from "./AccordionSection";

import BusinessDetailsForm from "../../Components/subcontractor/BusinessDetailsForm";
import ContactDetailsForm from "../../Components/subcontractor/ContactDetailsForm";
import TechnicianRatesForm from "../../Components/subcontractor/TechnicianRatesForm";
import AreaOfWorkForm from "../../Components/subcontractor/AreaOfWorkForm";
import InsuranceInfoForm from "../../Components/subcontractor/InsuranceInfoForm";
import UploadDocumentsForm from "../../Components/subcontractor/UploadDocumentsForm";
import ChangeStatusForm from "../../Components/subcontractor/ChangeStatusForm";
import SubcontractorNotes from "../../Components/SubcontractorNotes";

const EditSubContractor =
  () => {
    const {
      id,
    } =
      useParams();

    const dispatch =
      useDispatch();

    const {
      subcontractor,
      loadingDetails,
    } =
      useSelector(
        (
          state,
        ) =>
          state.subcontractor,
      );

    const {
      user_type,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
      );

    const {
      access,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user,
      );

    // FETCH
    useEffect(
      () => {
        dispatch(
          getSubcontractorInfoById(
            id,
          ),
        );
      },
      [
        dispatch,
        id,
      ],
    );

    // EDITABLE
    const isSubcontractor =
      user_type ===
      "Subcontractor";

    const allowedStatuses =
      [
        "Re-Opened",
        "In Progress",
      ];

    const isEditable =
      !isSubcontractor ||
      (isSubcontractor &&
        allowedStatuses.includes(
          subcontractor?.contract_status,
        ));

    // SECTIONS
    const sections =
      [
        {
          id: "business",
          label:
            "Business Details",
          icon: (
            <MdBusiness />
          ),
        },

        {
          id: "contact",
          label:
            "Contact Details",
          icon: (
            <MdPerson />
          ),
        },

        {
          id: "technician",
          label:
            "Technicians & Rates",
          icon: (
            <MdBuild />
          ),
        },

        {
          id: "area",
          label:
            "Area of Work",
          icon: (
            <MdLocationOn />
          ),
        },

        {
          id: "insurance",
          label:
            "Insurance Info",
          icon: (
            <MdSecurity />
          ),
        },

        {
          id: "documents",
          label:
            "Documents",
          icon: (
            <MdUploadFile />
          ),
        },

        {
          id: "status",
          label:
            user_type ===
            "Subcontractor"
              ? "Submit For Review"
              : "Update Status",

          icon: (
            <MdChecklist />
          ),
        },

        {
          id: "notes",
          label:
            "Notes",

          icon: (
            <MdNotes />
          ),
        },
      ];

    // SCROLL
    const scrollToSection =
      (
        sectionId,
      ) => {
        document
          .getElementById(
            sectionId,
          )
          ?.scrollIntoView(
            {
              behavior:
                "smooth",
              block:
                "start",
            },
          );
      };

    // STATUS STYLE
    const getStatusStyle =
      (
        status,
      ) => {
        switch (
          status
        ) {
          case "Active":
            return "bg-green-100 text-green-700 border border-green-200";

          case "In Progress":
            return "bg-yellow-100 text-yellow-700 border border-yellow-200";

          case "Re-Opened":
            return "bg-orange-100 text-orange-700 border border-orange-200";

          case "In Review":
            return "bg-blue-100 text-blue-700 border border-blue-200";

          default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
        }
      };

    return (
      <>
        <Header />

        <div className="flex">
          <AdminSideNavbar />

          <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-hidden">
            <div className="flex h-[calc(100vh-64px)]">
              {/* LEFT SIDEBAR */}
              <div className="hidden xl:flex w-[290px] border-r border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 h-full flex-col">
                {/* NAVIGATION */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {sections.map(
                      (
                        section,
                      ) => (
                        <button
                          key={
                            section.id
                          }
                          onClick={() =>
                            scrollToSection(
                              section.id,
                            )
                          }
                          className="group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 hover:shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-all duration-300">
                              {
                                section.icon
                              }
                            </div>

                            <span className="font-medium text-[#1E1B4B] text-sm">
                              {
                                section.label
                              }
                            </span>
                          </div>

                          <MdArrowForwardIos className="text-gray-400 text-sm group-hover:text-indigo-500" />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* MAIN CONTENT */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto p-4 md:p-6 xl:p-8">
                  {/* PAGE HEADER */}
                  <div className="bg-white rounded-[10px] shadow-lg border border-gray-100 overflow-hidden mb-8">
                    {/* TOP BAR */}

                    <div className="p-2 md:p-4">
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        {/* LEFT */}
                        <div className="flex items-start gap-5">
                        
                         <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
                            <MdBusiness className="text-3xl" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h1 className="text-xl font-bold text-[#1E1B4B] tracking-tight">
                                {subcontractor?.subcontractor_name ||
                                  "Subcontractor"}
                              </h1>

                              <div
                                className={`px-4 py-2 rounded-xl text-sm font-semibold ${getStatusStyle(
                                  subcontractor?.contract_status,
                                )}`}
                              >
                                {
                                  subcontractor?.contract_status
                                }
                              </div>
                            </div>
                            {/* QUICK STATS */}
                            {/* <div className="flex flex-wrap gap-2 mt-5">
                              <div className="bg-indigo-50 rounded-2xl px-4 py-3">
                                <p className="text-xs uppercase font-bold tracking-wide text-indigo-500">
                                  Coverage
                                </p>

                                <p className="text-sm font-semibold text-[#1E1B4B]">
                                  {subcontractor?.coverage_area ||
                                    "NA"}
                                </p>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LOADER */}
                  {loadingDetails ? (
                    <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-10">
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-5" />

                        <p className="text-gray-500 font-medium">
                          Loading
                          subcontractor
                          details...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* BUSINESS */}
                      <AccordionSection
                        id="business"
                        title="Business Details"
                        defaultOpen
                      >
                        <BusinessDetailsForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                          isEditable={
                            isEditable
                          }
                        />
                      </AccordionSection>

                      {/* CONTACT */}
                      <AccordionSection
                        id="contact"
                        title="Contact Details"
                      >
                        <ContactDetailsForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                          isEditable={
                            isEditable
                          }
                        />
                      </AccordionSection>

                      {/* TECHNICIAN */}
                      <AccordionSection
                        id="technician"
                        title="Technicians & Rate Details"
                      >
                        <TechnicianRatesForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                          isEditable={
                            isEditable
                          }
                        />
                      </AccordionSection>

                      {/* AREA */}
                      <AccordionSection
                        id="area"
                        title="Areas of Work"
                      >
                        <AreaOfWorkForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                          isEditable={
                            isEditable
                          }
                        />
                      </AccordionSection>

                      {/* INSURANCE */}
                      <AccordionSection
                        id="insurance"
                        title="Insurance Information"
                      >
                        <InsuranceInfoForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                          isEditable={
                            isEditable
                          }
                        />
                      </AccordionSection>

                      {/* DOCUMENTS */}
                      <AccordionSection
                        id="documents"
                        title="Upload Documents"
                      >
                        <UploadDocumentsForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                          isEditable={
                            isEditable
                          }
                        />
                      </AccordionSection>

                      {/* STATUS */}
                      <AccordionSection
                        id="status"
                        title={
                          user_type ===
                          "Subcontractor"
                            ? "Submit For Review"
                            : "Update Status"
                        }
                      >
                        <ChangeStatusForm
                          id={
                            id
                          }
                          data={
                            subcontractor
                          }
                        />
                      </AccordionSection>

                      {/* NOTES */}
                      {access.includes(
                        user_type,
                      ) && (
                        <AccordionSection
                          id="notes"
                          title="Subcontractor Notes"
                        >
                          <SubcontractorNotes
                            subcontractorId={
                              id
                            }
                            notes={
                              subcontractor?.subcontractorNotes ||
                              []
                            }
                          />
                        </AccordionSection>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default EditSubContractor;