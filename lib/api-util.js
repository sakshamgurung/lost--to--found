import axios from "axios";
import _ from "lodash";
import jwtDecode from "jwt-decode";

import { errorHandling } from "./error-handling";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export async function isAuth() {
	try {
		if (localStorage.getItem("jwtToken")) {
			const { data } = await axios.get(`${apiBase}/account/isAuth`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
			});
			return data;
		} else {
			return { isAuth: false };
		}
	} catch (error) {
		errorHandling(error);
		return { isAuth: false };
	}
}

export async function login(email, password) {
	const { data } = await axios.post(`${apiBase}/login`, {
		email: email,
		password: password,
	});
	const decoded = jwtDecode(data.tokens);
	localStorage.setItem("jwtToken", data.tokens);
	localStorage.setItem("name", decoded.name);
	localStorage.setItem("entityId", decoded.entityId);
	localStorage.setItem("email", decoded.email);

	return data;
}

export async function logout() {
	const { data } = await axios.delete(`${apiBase}/logout`, {
		headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
	});
	localStorage.removeItem("jwtToken");
	localStorage.removeItem("name");
	localStorage.removeItem("entityId");
	localStorage.removeItem("email");
	return data;
}

export async function createAccount(name, email, password) {
	const { data } = await axios.post(`${apiBase}/account`, {
		name: name,
		email: email,
		password: password,
	});
	return data;
}
