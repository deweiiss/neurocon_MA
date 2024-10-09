import axios from "axios";

class FileUploadService {
    upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        return axios.post("http://localhost:5000/input/csv", formData, {
            headers: {
                "Content-type": "mulitpart/form-processing",
            },
            onUploadProgress,
        });
    }

    getFiles() {
        return new axios.get("/input/files");
    }
}

export default new FileUploadService();