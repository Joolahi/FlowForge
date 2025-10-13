import axiosInstance from "./axiosInstance";

export const getProjects = async() => {
    const res = await axiosInstance.get("/projects", {
    });
    return res.data;
}

