import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSubcontractorInfoById } from "../../actions/subContractorAction";

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


const sections = [
  { id: "business", label: "Business Details" },
  { id: "contact", label: "Contact Details" },
  { id: "technician", label: "Technician & Rates" },
  { id: "area", label: "Area of Work" },
  { id: "insurance", label: "Insurance Info" },
  { id: "documents", label: "Documents" },
  { id: "status", label: "Change Status" },
  { id: "notes", label: "Notes" },
];

const EditSubContractor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { subcontractor, loadingDetails } = useSelector(
    (state) => state.subcontractor
  );

  useEffect(() => {
    dispatch(getSubcontractorInfoById(id));
  }, [dispatch, id]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header />

      <div className="flex">
        <AdminSideNavbar />

        <div className="flex-1 flex bg-gray-50">

          {/* LEFT STICKY NAV */}
          <div className="w-64 p-6 border-r bg-white sticky top-0 h-screen overflow-y-auto">
            <h3 className="font-bold mb-4">Sections</h3>

            <ul className="space-y-3 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="text-left w-full hover:text-indigo-600"
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-6 overflow-y-auto h-screen">

            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                {subcontractor?.subcontractor_name}
              </h1>
              <p className="text-gray-600">
                Status: {subcontractor?.contract_status}
              </p>
            </div>

            {loadingDetails ? (
              <div className="bg-white p-6 shadow rounded">
                Loading subcontractor...
              </div>
            ) : (
              <>
                <AccordionSection
                  id="business"
                  title="Business Details"
                  defaultOpen
                >
                  <BusinessDetailsForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="contact"
                  title="Contact Details"
                >
                  <ContactDetailsForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="technician"
                  title="Technician & Rates"
                >
                  <TechnicianRatesForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="area"
                  title="Area of Work"
                >
                  <AreaOfWorkForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="insurance"
                  title="Insurance Information"
                >
                  <InsuranceInfoForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="documents"
                  title="Upload Documents"
                >
                  <UploadDocumentsForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="status"
                  title="Change Status"
                >
                  <ChangeStatusForm id={id} data={subcontractor} />
                </AccordionSection>

                <AccordionSection
                  id="notes"
                  title="Subcontractor Notes"
                >
                  <SubcontractorNotes
                    subcontractorId={id}
                    notes={subcontractor?.subcontractorNotes || []}
                  />
                </AccordionSection>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSubContractor;