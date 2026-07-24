import api from "./axiosInstance.js";

const params = (value = {}) => ({ params: value });
const dataOf = (response) => response.data.data;

export const getAdminOverviewRequest = () => api.get("/admin/analytics/overview").then(dataOf);
export const getAdminCompaniesRequest = (query) => api.get("/admin/companies", params(query)).then(dataOf);
export const getAdminCompanyDetailsRequest = (id) => api.get(`/admin/companies/${id}`).then(dataOf);
export const updateAdminCompanyStatusRequest = (id, payload) => api.patch(`/admin/companies/${id}/status`, payload).then(dataOf);
export const getAdminUsersRequest = (query) => api.get("/admin/users", params(query)).then(dataOf);
export const getAdminUserDetailsRequest = (id) => api.get(`/admin/users/${id}`).then(dataOf);
export const updateAdminUserStatusRequest = (id, payload) => api.patch(`/admin/users/${id}/status`, payload).then(dataOf);
export const getAuditLogsRequest = (query) => api.get("/admin/audit-logs", params(query)).then(dataOf);
export const getSystemHealthRequest = () => api.get("/admin/system-health").then(dataOf);
