import { useState, useEffect, useRef, useContext } from "react";

import _ from "lodash";
import classNames from "classnames";

import AuthContext from "../../store/auth-context";
import SubmissionList from "../../components/submission/SubmissionList";
import AddEdit from "../../components/submission/AddEdit";
import {
	searchSubmissionsByFullText,
	searchSubmissionsByCategory,
	fetchLatestSubmissions,
} from "../../lib/submission-api";
import { getAllCategory } from "../../lib/category-api";

function Lost() {
	const authCtx = useContext(AuthContext);
	const [hits, setHits] = useState();
	const [cat, setCat] = useState();
	const [selectedCat, setSelectedCat] = useState({ label: "All", value: "All" });
	const [rightSection, setRightSection] = useState(null);
	const [searched, setSearched] = useState("");
	const searchInputRef = useRef(null);

	useEffect(() => {
		const getLatestSubmissions = async () => {
			const data = await fetchLatestSubmissions("lost");
			setHits(data);
		};

		if (searched.length === 0 && selectedCat.value === "All") {
			getLatestSubmissions();
		}
	}, [searched, selectedCat]);

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

	const search = _.debounce(async (event) => {
		const search = event.target.value;
		setSearched(search);
		if (search.length > 2) {
			const data = await searchSubmissionsByFullText("lost", search);
			setHits(data);
		}
	}, 1000);

	const searchByCategory = async (category) => {
		if (category.value === "All") {
			searchInputRef.current.value = "";
			setSearched("");
			setSelectedCat(category);
		} else {
			const data = await searchSubmissionsByCategory("lost", category.value);
			searchInputRef.current.value = "";
			setSearched("");
			setSelectedCat(category);
			setHits(data);
		}
	};

	if (!authCtx.auth) {
		return null;
	} else {
		return (
			<div className="flex flex-row ml-56">
				<div className="flex-1 min-h-screen border-r border-r-gray-300">
					<section className="flex flex-row justify-center mx-6 my-2">
						<input
							ref={searchInputRef}
							disabled={selectedCat.value === "All" ? false : true}
							onChange={search}
							type="text"
							placeholder={selectedCat.value === "All" ? "Search..." : selectedCat.label}
							className="min-w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-md focus:ring-blue-400 focus:border-blue-400 p-2.5"
						/>
					</section>
					<section className="flex flex-row gap-3 mx-6 my-4 text-slate-50 h-16 overflow-x-scroll overflow-y-hidden">
						<button
							key="All"
							onClick={() => searchByCategory({ label: "All", value: "All" })}
							className={classNames(
								"border border-primary rounded-xl px-3 my-2 h-8",
								{ "bg-primary text-slate-200": selectedCat.value === "All" },
								{ "text-primary hover:bg-primary hover:text-slate-200": selectedCat.value != "All" }
							)}
						>
							All
						</button>
						{cat
							? cat.map((c) => (
									<button
										key={c.value}
										onClick={() => searchByCategory({ label: c.label, value: c.value })}
										className={classNames(
											"border border-primary rounded-xl px-3 my-2 h-8",
											{ "bg-primary text-slate-200": selectedCat.value === c.value },
											{
												"text-primary hover:bg-primary hover:text-slate-200":
													selectedCat.value != c.value,
											}
										)}
									>
										{c.label}
									</button>
							  ))
							: null}
					</section>

					<SubmissionList
						rightSection={rightSection}
						setRightSection={setRightSection}
						data={hits}
					/>
				</div>
				<div className="flex-1 min-h-screen">
					{rightSection === null ? (
						<div className="flex flex-col justify-center items-center min-h-full">
							<p className="text-xl text-gray-700">No detail to show</p>
						</div>
					) : null}
					{rightSection?.type === "submissionItem" ? (
						<AddEdit
							rightSection={rightSection}
							setRightSection={setRightSection}
							isExploreMode={true}
							isAddMode={false}
							cat={cat}
							submission={hits[rightSection.index]}
						/>
					) : null}
				</div>
			</div>
		);
	}
}

export default Lost;
