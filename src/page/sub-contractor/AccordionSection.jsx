import React, { useState } from "react";

const AccordionSection = ({
  id,
  title,
  children,
  defaultOpen = false,
  loading = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="bg-white shadow rounded-lg mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold"
      >
        <span>{title}</span>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t">
          {loading ? (
            <div className="py-4 text-gray-500">Loading...</div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;