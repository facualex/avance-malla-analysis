import axios from 'axios'


const AxiosInstance = axios.create({ baseURL: process.env.API_URL || 'http://localhost:4000'})
const API = {}

API.uploadFile = (file) => AxiosInstance.post('/upload',  file)
API.getCourses = () => AxiosInstance.get('/courses')

export default API