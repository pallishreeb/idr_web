import React, {  useEffect, useRef } from 'react';


function NoteTextarea({ note, index, handleNoteChange, editingIndex }) {
  const textareaRef = useRef(null);

  // Auto-resize when value changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [note?.comments]);

  return (
    <textarea
      ref={textareaRef}
      className="px-2 py-2 border text-sm border-gray-200 rounded w-full overflow-hidden resize-none leading-5"
      name="comments"
      value={note?.comments || ""}
      onChange={(e) => handleNoteChange(index, e)}
      disabled={editingIndex !== index}
      style={{
        minHeight: '96px',
        lineHeight: '1.25rem',
      }}
    />
  );
}

export default NoteTextarea;