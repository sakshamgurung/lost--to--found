import axios from "axios";
import _ from "lodash";

const apiBase = process.env.NEXT_PUBLIC_API_URL;

export async function createSubmission(submission) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.post(`${apiBase}/submission`, submission, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
		});
		return data;
	}
}

export async function fetchSubmissionByUserId() {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.get(
			`${apiBase}/submission/user/${localStorage.getItem("entityId")}`,
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
			}
		);
		return data;
	}
}

export async function fetchLatestSubmissions(submissionType) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.get(`${apiBase}/submission/date/latest`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
			params: {
				excludeUserId: localStorage.getItem("entityId"),
				submissionType: submissionType,
			},
		});
		return data;
	}
}

export async function searchSubmissionsByFullText(submissionType, search) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.get(`${apiBase}/submission/search`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
			params: {
				search: search,
				excludeUserId: localStorage.getItem("entityId"),
				submissionType: submissionType,
			},
		});
		return data;
	}
}

export async function searchSubmissionsByCategory(submissionType, category) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.get(`${apiBase}/submission/category`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
			params: {
				category: category,
				excludeUserId: localStorage.getItem("entityId"),
				submissionType: submissionType,
			},
		});
		return data;
	}
}

export async function updateSubmission(id, submission) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.put(`${apiBase}/submission/${id}`, submission, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
		});
		return data;
	}
}

export async function deleteSubmission(id) {
	if (localStorage.getItem("jwtToken")) {
		const { data } = await axios.delete(`${apiBase}/submission/${id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
		});
		return data;
	}
}
