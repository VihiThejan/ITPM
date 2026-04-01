import { apiClient } from "./apiClient";

export const registerUser = async (payload) => {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
};

export const getMe = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};

export const loginRoleUser = async (payload) => {
  const response = await apiClient.post("/auth/login/role", payload);
  return response.data;
};

export const registerStudentUser = async (payload) => {
  const response = await apiClient.post("/students/register", payload);
  return response.data;
};

export const registerHostelOwnerUser = async (payload) => {
  const response = await apiClient.post("/hostel-owners/register", payload);
  return response.data;
};

export const sendOtpCode = async (payload) => {
  const response = await apiClient.post("/otp/send", payload);
  return response.data;
};

export const verifyOtpCode = async (payload) => {
  const response = await apiClient.post("/otp/verify", payload);
  return response.data;
};

export const resendOtpCode = async (payload) => {
  const response = await apiClient.post("/otp/resend", payload);
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await apiClient.get(`/students/${id}`);
  return response.data;
};

export const updateStudentById = async (id, payload) => {
  const response = await apiClient.put(`/students/${id}`, payload);
  return response.data;
};

export const getHostelOwnerById = async (id) => {
  const response = await apiClient.get(`/hostel-owners/${id}`);
  return response.data;
};

export const updateHostelOwnerById = async (id, payload) => {
  const response = await apiClient.put(`/hostel-owners/${id}`, payload);
  return response.data;
};

export const getAllStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data;
};

export const getAllHostelOwners = async () => {
  const response = await apiClient.get("/hostel-owners");
  return response.data;
};

export const loginAdminUser = async (email, password) => {
  return loginRoleUser({ email, password, role: "admin" });
};
