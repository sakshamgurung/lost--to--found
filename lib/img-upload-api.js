import axios from "axios";
import _ from "lodash";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export async function uploadImage(formData) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.post(`${apiBase}/upload`, formData, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
		});
		return data;
	}
}
