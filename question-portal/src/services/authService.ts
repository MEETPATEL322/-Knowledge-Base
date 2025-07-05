import axios from "axios";

const API = process.env.REACT_APP_API_URL;

export const login = async (email: string, password: string) => {
  try {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("token", data.accessToken);
    return data.user;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
  role: string
) => {
  try {
    const { data } = await axios.post(`${API}/auth/signup`, {
      email,
      password,
      role,
      name,
    });
    return data.user;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const getCurrentUser = async (token: string) => {
  try {
    const { data } = await axios.get(`${API}/auth/tokenUserDetails`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};

export const getallQuestions = async (token: string, query?: any) => {
  try {
    const params = query ? { ...query } : {};

    const { data } = await axios.get(`${API}/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    throw new Error(message);
  }
};

export const approveQuestion = async (
  quetionId: string,
  token: string,
  bodyData: any
) => {
  try {
    const { data } = await axios.patch(
      `${API}/questions/approve/${quetionId}`,
      bodyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data.message || "Question approved successfully";
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Approval failed";
    throw new Error(message);
  }
};

export const addQuestion = async (token: string, bodyData: any) => {
  try {
    const { data } = await axios.post(`${API}/questions`, bodyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data.data || "Question added successfully";
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "question adding Failed failed";
    throw new Error(message);
  }
};

export const getDashboard = async (token: string, query?: any) => {
  try {
    const params = query ? { ...query } : {};

    const { data } = await axios.get(`${API}/questions/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return data.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Request failed";
    throw new Error(message);
  }
};
