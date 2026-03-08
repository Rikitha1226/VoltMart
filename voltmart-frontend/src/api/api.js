import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});


// PRODUCTS API
export const productsApi = {

  list: () => API.get("/products"),   // used in AdminDashboard

  getById: (id) => API.get(`/products/${id}`),

  add: (product) => API.post("/products", product),

  update: (id, product) => API.put(`/products/${id}`, product),

  delete: (id) => API.delete(`/products/${id}`),

  lowStock: () => API.get("/products/low-stock"),

  searchByName: (name) =>
    API.get(`/products/search?name=${name}`),
};


// ORDERS API
export const ordersApi = {

  create: (phone, items) =>
    API.post("/orders", {
      customerPhone: phone,
      items: items
    }),

  list: () => API.get("/orders")

};


// AUTH API
export const authApi = {

  login: (data) => API.post("/auth/login", data),

  register: (data) => API.post("/auth/register", data),

};


// USERS API
export const usersApi = {

  getProfile: () => API.get("/users/profile"),

  updateProfile: (data) =>
    API.put("/users/profile", data),

};