import axios from "../axios-config";
import { toast } from "react-toastify";
import {
  rmaStart,
  rmaSuccess,
  rmaFailure,
  getRMAListsStart,
  getRMAListsSuccess,
  getRMAListsFailure,
  deleteRMAStart,
  deleteRMASuccess,
  deleteRMAFailure,
  updateRMAStart,
  updateRMASuccess,
  updateRMAFailure,
  getRMADetailsStart,
  getRMADetailsSuccess,
  getRMADetailsFailure,
  addNotesToRmaStart,
  addNotesToRmaSuccess,
  addNotesToRmaFailure,
  addAttachmentsToRmaStart,
  addAttachmentsToRmaSuccess,
  addAttachmentsToRmaFailure,
  deleteRmaNoteStart,
  deleteRmaNoteSuccess,
  deleteRmaNoteFailure,

} from "../reducers/rmaSlice";
import { apiConfig } from "../config";
import { fetchJson } from '../fetch-config';

// Generate a new RMA
export const generateRMA = (rmaData,navigate) => {
  return async (dispatch) => {
    dispatch(rmaStart());
    try {
      const data = await fetchJson(apiConfig.generateRMA, {
        method: 'POST',
        body: rmaData,
      });

      dispatch(rmaSuccess(data));
      toast.success("RMA generated successfully");
      navigate('/device-rma')
      return data;
    } catch (error) {
      console.error('Error occurred:', error);
      dispatch(rmaFailure(error.message));
      toast.error(error.message || "Failed to generate RMA");
    }
  };
};

// Get all RMA lists with optional filters
export const getRmaLists = (filters) => {
  return async (dispatch) => {
    dispatch(getRMAListsStart());
    try {
      const params = new URLSearchParams();

      for (const key in filters) {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      }

      const queryString = params.toString();
      const url = queryString ? `${apiConfig.getRMALists}?${queryString}` : apiConfig.getRMALists;
      const response = await axios.get(url);

      dispatch(getRMAListsSuccess(response?.data?.Rma));
    } catch (error) {
      dispatch(getRMAListsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch RMA lists");
    }
  };
};

// Delete an RMA
export const deleteRma = (rmaId) => {
  return async (dispatch) => {
    dispatch(deleteRMAStart());
    try {
      await axios.delete(`${apiConfig.deleteRMA}/${rmaId}`);
      dispatch(deleteRMASuccess(rmaId));
      toast.success("RMA deleted successfully");
    } catch (error) {
      dispatch(deleteRMAFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete RMA");
    }
  };
};

// Update an RMA
export const updateRMA = (rmaData) => {
  return async (dispatch) => {
    dispatch(updateRMAStart());
    try {
      const response = await axios.patch(`${apiConfig.updateRMA}`, rmaData);
      dispatch(updateRMASuccess(response.data));
      toast.success("RMA updated successfully");
      getRMADetails(rmaData?.rmaId)
    } catch (error) {
      dispatch(updateRMAFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to update RMA");
    }
  };
};

// Get RMA details by ID
export const getRMADetails = (rmaId) => {
  return async (dispatch) => {
    dispatch(getRMADetailsStart());
    try {
      const url = `${apiConfig.getRMAByID}/${rmaId}`;
      const response = await axios.get(url);
      dispatch(getRMADetailsSuccess(response.data?.rma));
      return response.data?.rma;
    } catch (error) {
      dispatch(getRMADetailsFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to fetch RMA details");
    }
  };
};

export const addNotesToRma = ( notesData) => {
  return async (dispatch) => {
    dispatch(addNotesToRmaStart());
    try {
      const response = await axios.post(`${apiConfig.addNoteToRma}`, notesData);
      // console.log("res",response)
      if(response?.data){
        dispatch(addNotesToRmaSuccess(response?.data));
        toast.success("Notes added to RMA successfully");
        return response?.data
      }else{
        dispatch(addNotesToRmaFailure(response?.data?.message));
         toast.error("Failed to add notes to RMA");
      }
   
    } catch (error) {
      console.log("err",error)
      dispatch(addNotesToRmaFailure(error?.message));
      toast.error(error?.message || error?.response?.data?.message || "Failed to add notes to RMA");
    }
  };
};

export const deleteRmaNote = (noteId) => {
  return async (dispatch) => {
    dispatch(deleteRmaNoteStart());
    try {
      const response = await axios.delete(`${apiConfig.deleteNoteForRma}/${noteId}`);

      if(response?.data?.code == "RMA203"){
        dispatch(deleteRmaNoteSuccess(noteId));
        toast.success("Comment deleted successfully");
        return response?.code
      }else{
        dispatch(addNotesToRmaFailure(response?.data?.message));
         toast.error("Failed to add notes to RMA");
      }

    } catch (error) {
      dispatch(deleteRmaNoteFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to delete Comment");
    }
  };
};


export const uploadRmaImages = (rmaId, images) => {
  return async (dispatch) => {
    dispatch(addAttachmentsToRmaStart());

    const formData = new FormData();
    formData.append("rma_id", rmaId);

    images.forEach((image, index) => {
      formData.append(`image`, image);
    });

    try {
      const response = await axios.post(`${apiConfig.addAttachmentToRma}/${rmaId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("response from image upload",response)
      dispatch(addAttachmentsToRmaSuccess(response?.data));
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      dispatch(addAttachmentsToRmaFailure(error.message));
      toast.error(error.response?.data?.message || "Failed to upload images.");
    }
  };
};
