import axios from "../axios-config";
import { toast } from "react-toastify";
import {
  subcontractorStart,
  subcontractorSuccess,
  subcontractorFailure,
  getSubcontractorListsStart,
  getSubcontractorListsSuccess,
  getSubcontractorListsFailure,
  deleteSubcontractorStart,
  deleteSubcontractorSuccess,
  deleteSubcontractorFailure,
  updateSubcontractorStart,
  updateSubcontractorSuccess,
  updateSubcontractorFailure,
  getSubcontractorDetailsStart,
  getSubcontractorDetailsSuccess,
  getSubcontractorDetailsFailure,
  addNotesToSubcontractorStart,
  addNotesToSubcontractorSuccess,
  addNotesToSubcontractorFailure,
  deleteSubcontractorNoteStart,
  deleteSubcontractorNoteSuccess,
  deleteSubcontractorNoteFailure,
  getSubcontractorTypesStart,
  getSubcontractorTypesSuccess,
  getSubcontractorTypesFailure,
  getSubcontractorServicesStart,
  getSubcontractorServicesSuccess,
  getSubcontractorServicesFailure,
} from "../reducers/subcontractorSlice";
import { apiConfig } from "../config";
import { fetchJson } from '../fetch-config';


// Register Subcontractor
export const registerSubcontractor = (subcontractorData) => {
  return async (dispatch) => {
    dispatch(subcontractorStart());
    try {
      const data = await fetchJson(apiConfig.registerSubcontractor, {
        method: "POST",
        body: subcontractorData,
      });
      console.log(data, "data");
      dispatch(subcontractorSuccess(data));
      toast.success("Subcontractor registered successfully");
      return data; // important if you want to navigate after success
    } catch (error) {
      dispatch(subcontractorFailure(error?.message));
      toast.error(error?.message || "Failed to register subcontractor");
      throw error;
    }
  };
};
// Add a new subcontractor
export const addSubcontractor = (subcontractorData, navigate) => {
  return async (dispatch) => {
    dispatch(subcontractorStart());
    try {
      const data = await fetchJson(apiConfig.addSubcontractor, {
        method: 'POST',
        body: subcontractorData,
      });
      dispatch(subcontractorSuccess(data));
      toast.success("Subcontractor added successfully");
      navigate('/sub-contractors');
      return data;
    } catch (error) {
      dispatch(subcontractorFailure(error.message));
      toast.error(error.message || "Failed to add subcontractor");
    }
  };
};

// Get all subcontractors with optional filters
export const getSubcontractorLists = (filters) => {
  return async (dispatch) => {
    dispatch(getSubcontractorListsStart());
    try {
      const params = new URLSearchParams(filters).toString();
      const url = params ? `${apiConfig.getSubcontractorLists}?${params}` : apiConfig.getSubcontractorLists;
      const response = await axios.get(url);
      dispatch(getSubcontractorListsSuccess(response?.data?.subcontractors));
    } catch (error) {
      dispatch(getSubcontractorListsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch subcontractor lists");
    }
  };
};

// Delete a subcontractor
export const deleteSubcontractor = (subcontractorId) => {
  return async (dispatch) => {
    dispatch(deleteSubcontractorStart());
    try {
      await axios.delete(`${apiConfig.deleteSubcontractor}/${subcontractorId}`);
      dispatch(deleteSubcontractorSuccess(subcontractorId));
      toast.success("Subcontractor deleted successfully");
    } catch (error) {
      dispatch(deleteSubcontractorFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete subcontractor");
    }
  };
};



// Update subcontractor details
export const updateSubcontractor = (subcontractorData) => {
  return async (dispatch) => {
    dispatch(updateSubcontractorStart());
    try {
      const data = await fetchJson(apiConfig.updateSubcontractor, {
        method: 'PATCH',
        body: subcontractorData,
      });
      dispatch(updateSubcontractorSuccess(data));
      toast.success("Subcontractor updated successfully");
      return data;
    } catch (error) {
      dispatch(updateSubcontractorFailure(error.message));
      toast.error(error.message || "Failed to update subcontractor");
    }
  };
};

// Get subcontractor details by ID
export const getSubcontractorDetails = (subcontractorId) => {
  return async (dispatch) => {
    dispatch(getSubcontractorDetailsStart());
    try {
      const response = await axios.get(`${apiConfig.getSubcontractorByID}/${subcontractorId}`);
      dispatch(getSubcontractorDetailsSuccess(response.data?.contractor));
      return response.data?.contractor;
    } catch (error) {
      dispatch(getSubcontractorDetailsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch subcontractor details");
    }
  };
};

// Add Notes to Subcontractor
export const addNotesToSubcontractor = (notesData) => {
    return async (dispatch) => {
      dispatch(addNotesToSubcontractorStart());
      try {
        const data = await fetchJson(apiConfig.addNoteToSubcontractor, {
          method: "POST",
          body: notesData,
        });
        dispatch(addNotesToSubcontractorSuccess(data));
        toast.success("Note added successfully");
        return data;
      } catch (error) {
        dispatch(addNotesToSubcontractorFailure(error.message));
        toast.error(error.message || "Failed to add note");
      }
    };
  };
  
  // Delete Subcontractor Note
  export const deleteSubcontractorNote = (noteId) => {
    return async (dispatch) => {
      dispatch(deleteSubcontractorNoteStart());
      try {
        await axios.delete(`${apiConfig.deleteNoteForSubcontractor}/${noteId}`);
        dispatch(deleteSubcontractorNoteSuccess(noteId));
        toast.success("Note deleted successfully");
      } catch (error) {
        dispatch(deleteSubcontractorNoteFailure(error.message));
        toast.error(error.response?.data?.message || "Failed to delete note");
      }
    };
  };


  // Get all subcontractors Types
export const getSubcontractorTyes= () => {
  return async (dispatch) => {
    dispatch(getSubcontractorTypesStart());
    try {
      const response = await axios.get(`${apiConfig.subcontractorTypes}`);
      dispatch(getSubcontractorTypesSuccess(response?.data?.types));
    } catch (error) {
      dispatch(getSubcontractorTypesFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch subcontractor types");
    }
  };
};


  // Get all subcontractors Types
  export const getSubcontractorServices= () => {
    return async (dispatch) => {
      dispatch(getSubcontractorServicesStart());
      try {
        const response = await axios.get(`${apiConfig.subcontractorServices}`);
        dispatch(getSubcontractorServicesSuccess(response?.data?.services));
      } catch (error) {
        dispatch(getSubcontractorServicesFailure(error.message));
        toast.error(error.response?.data?.message || "Failed to fetch subcontractor services");
      }
    };
  };

  export const updateContactDetails = (payload) => {
  return async () => {
    try {
      await fetchJson(apiConfig.contactDetailsUpdate, {
        method: "PUT",
        body: payload,
      });

      toast.success("Contact details updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update contact details");
    }
  };
};

export const updateTechnicianRates = (payload) => {
  return async () => {
    try {
      await fetchJson(apiConfig.technician_rates_update, {
        method: "PUT",
        body: payload,
      });

      toast.success("Technician & Rates updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update technician data");
    }
  };
};

export const updateBusinessDetails = (payload) => {
  return async () => {
    try {
      await fetchJson(apiConfig.businessDetailsUpdate, {
        method: "PUT",
        body: payload,
      });

      toast.success("Technician & Rates updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update technician data");
    }
  };
};

export const updateAreaOfWork = (payload) => {
  return async () => {
    try {
      await fetchJson(apiConfig.areaOfWorkUpdate, {
        method: "PUT",
        body: payload,
      });

      toast.success("Area of work updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update area of work");
    }
  };
};

export const updateInsuranceInfo = (payload) => {
  return async () => {
    try {
      await fetchJson(apiConfig.insuranceInfoUpdate, {
        method: "PUT",
        body: payload,
      });

      toast.success("Insurance information updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update insurance info");
    }
  };
};

export const uploadSubcontractorDocument = (formData) => {
  return async () => {
    try {
      await axios.post(
        apiConfig.uploadSubcontractorDoc,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Document uploaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
      throw error;
    }
  };
};

// subContractorAction.js

export const getSubcontractorInfoById = (subcontractorId) => {
  return async (dispatch) => {
    dispatch(getSubcontractorDetailsStart());

    try {
      const response = await axios.get(
        `${apiConfig.getSubcontractorInfoByID}/${subcontractorId}`
      );

      dispatch(
        getSubcontractorDetailsSuccess(response.data.contractor)
      );

      return response.data.contractor;

    } catch (error) {
      dispatch(getSubcontractorDetailsFailure(error.message));
      toast.error(
        error?.response?.data?.message || "Failed to fetch subcontractor"
      );
      throw error;
    }
  };
};

export const changeSubcontractorStatus = (payload) => {
  return async () => {
    try {
      await fetchJson(apiConfig.changeSubcontractorStatus, {
        method: "POST",
        body: payload,
      });

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update status");
      throw error;
    }
  };
};