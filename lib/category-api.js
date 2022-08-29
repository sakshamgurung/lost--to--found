import axios from "axios";

import { errorHandling } from "./error-handling";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export async function getAllCategory() {
	try {
		const { data } = await axios.get(`${apiBase}/category`);
		return data;
	} catch (error) {
		errorHandling(error);
	}
}
