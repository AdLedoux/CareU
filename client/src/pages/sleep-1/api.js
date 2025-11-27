import api from "../../api";

const base = "/api/sleep/";

export const fetchSleepLogs = (params = {}) => api.get(`${base}logs/`, { params });

export const createSleepLog = (payload) => api.post(`${base}logs/`, payload);

export const importSleepData = ({ file, useSample = false } = {}) => {
  if (useSample) {
    return api.post(`${base}import/?use_sample=true`);
  }
  const form = new FormData();
  form.append("file", file);
  // Let axios set the Content-Type with proper boundary
  return api.post(`${base}import/`, form);
};

export const fetchSleepSummary = (params = {}) => api.get(`${base}summary/`, { params });
