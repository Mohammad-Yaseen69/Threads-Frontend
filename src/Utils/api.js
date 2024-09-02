import axios from "axios"

export const makeRequest = async (url, options) => {
    try {
        const response = await axios(`${import.meta.env.VITE_SERVER_PATH}api/v1/${url}`, {
            withCredentials: true,
            ...options
        })

        return  {response: response.data};
    } catch (error) {
        console.log(error)
        return {error: error.response.data}
    }
}