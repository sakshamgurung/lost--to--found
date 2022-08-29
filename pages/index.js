import { useEffect, useState, useContext } from "react";

import { AiOutlinePlusSquare } from "react-icons/ai";
import { IoMdRefresh } from "react-icons/io";

import AuthContext from "../store/auth-context";
import SubmissionList from "../components/submission/SubmissionList";
import AddEdit from "../components/submission/AddEdit";
import { fetchSubmissionByUserId } from "../lib/submission-api";
import { getAllCategory } from "../lib/category-api";

function Submission() {
	const authCtx = useContext(AuthContext);
	const [refresh, setRefresh] = useState(false);
	const [submissionList, setSubmissionList] = useState(null);
	const [cat, setCat] = useState();
	const [rightSection, setRightSection] = useState(null);

	useEffect(() => {
		const fetchSubmission = async () => {
			try {
				const data = await fetchSubmissionByUserId();
				setSubmissionList(data);
				setRefresh(false);
			} catch (error) {
				console.log("Error fetching submission list: ", error);
			}
		};
		fetchSubmission();
	}, [refresh, rightSection]);

	useEffect(() => {
		const fetchCat = async () => {
			try {
				let catData = await getAllCategory();
				catData = catData.map((cat) => {
					return { label: cat.name, value: cat.entityId };
				});
				setCat(catData);
			} catch (error) {
				console.error(error);
			}
		};
		fetchCat();
	}, []);

	if (!authCtx.auth) {
		return null;
	} else {
		return (
			<div className="flex flex-row ml-56">
				<div className="flex-1 min-h-screen border-r border-r-gray-300">
					<section className="flex flex-row items-center justify-end mx-6 my-2">
						<button
							className="flex flex-row items-center px-2 py-1 h-10 font-light rounded-md bg-primary hover:bg-blue-500 text-slate-100"
							onClick={() => setRightSection("newSubmissionForm")}
						>
							<AiOutlinePlusSquare size="20" className="mr-3" />
							Make Submission
						</button>
						<div className="flex flex-row items-center bg-primary px-2 py-1 ml-5 h-10 font-light rounded-md text-slate-100 hover:bg-blue-500 hover:cursor-pointer">
							<IoMdRefresh size="20" onClick={() => setRefresh(true)} />
						</div>
					</section>
					<SubmissionList
						rightSection={rightSection}
						setRightSection={setRightSection}
						data={submissionList}
					/>
				</div>
				<div className="flex-1 min-h-screen">
					{rightSection === null ? (
						<div className="flex flex-col justify-center items-center min-h-full">
							<p className="text-xl text-gray-700">No detail to show</p>
						</div>
					) : null}
					{rightSection === "newSubmissionForm" ? (
						<AddEdit
							rightSection={rightSection}
							setRightSection={setRightSection}
							cat={cat}
							isAddMode={true}
						/>
					) : null}
					{rightSection?.type === "submissionItem" ? (
						<AddEdit
							rightSection={rightSection}
							setRightSection={setRightSection}
							isAddMode={false}
							cat={cat}
							submission={submissionList[rightSection.index]}
						/>
					) : null}
				</div>
			</div>
		);
	}
}

export default Submission;
