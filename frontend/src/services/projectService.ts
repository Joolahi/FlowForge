import axiosInstance from "./axiosInstance";

export const getProjects = async() => {
    const res = await axiosInstance.get("/projects", {
    });
    return res.data;
}


export const getProjectById = async(id: number) => {
    const res = await axiosInstance.get(`/projects/${id}`);
    return res.data;
}