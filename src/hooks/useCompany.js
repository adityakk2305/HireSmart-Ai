import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCompany as createCompanyThunk,
  fetchMyCompany,
  initializeCompany,
  updateCompany as updateCompanyThunk,
  uploadCompanyLogo as uploadCompanyLogoThunk
} from "../features/company/companySlice.js";

const useCompany = () => {
  const dispatch = useDispatch();
  const companyState = useSelector((state) => state.company);

  return {
    ...companyState,
    fetchCompany: useCallback(() => dispatch(fetchMyCompany()).unwrap(), [dispatch]),
    initializeCompany: useCallback(() => dispatch(initializeCompany()).unwrap(), [dispatch]),
    createCompany: useCallback((payload) => dispatch(createCompanyThunk(payload)).unwrap(), [dispatch]),
    updateCompany: useCallback((payload) => dispatch(updateCompanyThunk(payload)).unwrap(), [dispatch]),
    uploadCompanyLogo: useCallback((file) => dispatch(uploadCompanyLogoThunk(file)).unwrap(), [dispatch])
  };
};

export default useCompany;
