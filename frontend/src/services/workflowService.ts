import axiosInstance from "./axiosInstance";

export const getWorkflowSteps = async (projectId: number) => {
    const response = await axiosInstance.get(`/workflows/${projectId}`);
    return response.data;
};

export const saveWorkflowStep = async (stepData: any) => {
    if (stepData.id && !isNaN(Number(stepData.id))) {
        // Päivitä olemassa oleva steppi
        const { id, ...updateData } = stepData;
        const response = await axiosInstance.put(`/workflows/${id}`, updateData);
        return response.data;
    } else {
        // Luo uusi steppi
        const { project_id, ...createData } = stepData;
        const response = await axiosInstance.post(`/workflows/${project_id}`, createData);
        return response.data;
    }
};