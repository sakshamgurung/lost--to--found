import { useState, useEffect, Fragment } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";
import DatePicker from "react-datepicker";
import _ from "lodash";

import { createSubmission, deleteSubmission } from "../../lib/submission-api";
import { uploadImage } from "../../lib/img-upload-api";
import PhotoForm from "./PhotoForm";
import MapForm from "./MapForm";
import Spinner from "../ui/Spinner";

function AddEdit({
	rightSection,
	setRightSection,
	isAddMode,
	isExploreMode = false,
	cat,
	submission,
}) {
	const type = [
		{ label: "Lost", value: "lost" },
		{ label: "Found", value: "found" },
	];

	const [selectedImages, setSelectedImages] = useState([]);
	const [locs, setLocs] = useState([]);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const validationSchema = Yup.object().shape({
		type: Yup.object().required("Type is required"),
		date: Yup.string().required("Date is required"),
		category: Yup.object().required("Category is required"),
		itemName: Yup.string().required("Item Name is required"),
		location: Yup.string(),
		description: Yup.string().max(2000),
		email: Yup.string().email("Email is invalid").required("Email is required"),
	});

	const formOptions = {
		resolver: yupResolver(validationSchema),
	};

	const { register, control, handleSubmit, reset, setValue, formState } = useForm(formOptions);
	const { errors } = formState;

	useEffect(() => {
		if (!isAddMode) {
			const fields = ["type", "date", "category", "itemName", "description", "email"];
			fields.forEach((field) => {
				if (field === "type") {
					const index = _.findIndex(type, (t) => {
						return t.value == submission.type;
					});
					setValue(field, type[index]);
					return;
				}
				if (field === "date") {
					setValue(field, new Date(submission[field]));
					return;
				}
				if (field === "category") {
					const index = _.findIndex(cat, (c) => {
						return c.value == submission.category;
					});
					setValue(field, cat[index]);
					return;
				}
				setValue(field, submission[field]);
			});

			const locFromSubmission = [];
			let imgFromSubmission = [];

			for (let i = 0; i < 3; i++) {
				if (submission[`location${i + 1}`] != null) {
					locFromSubmission.push(submission[`location${i + 1}`]);
				}
			}

			if (submission.imageUrl.length != 0) {
				submission.imageUrl.forEach((i) => {
					imgFromSubmission.push(`${process.env.NEXT_PUBLIC_API_URL}/images/${i}`);
				});
			}

			setLocs(locFromSubmission);
			setSelectedImages(imgFromSubmission);
		}
	}, [rightSection]);

	useEffect(() => {
		if (formState.isSubmitSuccessful && submitSuccess) {
			reset();
			setRightSection(null);
		}
	}, [formState, submitSuccess, reset]);

	function onSubmit(data) {
		if (isAddMode && selectedImages.length == 0) {
			alert("Pick atleast one image of lost or found item");
			return;
		}

		if (isAddMode && locs.length == 0) {
			alert("Pick atleast one lost or found location");
			return;
		}

		data.category = data.category.value;
		data.type = data.type.value;
		data.date = new Date(data.date).toISOString();
		for (let i = 0; i < locs.length; i++) {
			data[`location${i + 1}`] = locs[i];
		}

		return isAddMode ? onAddSubmission(data) : onDeleteSubmission();
	}

	function onAddSubmission(data) {
		data.userId = localStorage.getItem("entityId");
		const uploadedImages = new FormData();
		selectedImages.forEach((img) => {
			uploadedImages.append("images[]", img);
		});

		uploadImage(uploadedImages)
			.then((res) => {
				data.imageUrl = res.imageUrl;
				createSubmission(data)
					.then((res2) => {
						setSubmitSuccess(true);
					})
					.catch((error) => {
						console.log("Form submission error: ", error);
					});
			})
			.catch((error) => {
				console.log("Image upload error: ", error);
			});
	}

	function onDeleteSubmission() {
		deleteSubmission(submission.entityId)
			.then((res) => {
				console.log("Deleted submission id: ", res);
				setSubmitSuccess(true);
			})
			.catch((error) => {
				console.log("Submission delete error: ", error);
			});
	}

	return (
		<section className="flex flex-col min-h-screen p-4 bg-slate-50">
			<div className="flex items-center mb-3">
				<BsFillArrowLeftSquareFill
					size="20"
					className="mr-3"
					color="#F02E65"
					onClick={() => setRightSection(null)}
				/>
				<h4 className="text-2xl font-medium text-center">
					{isAddMode ? "Add New Submission" : "Submission"}
				</h4>
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col">
					<div className="flex flex-row items-center flex-1 ">
						<label className="">Type</label>
						<div className="ml-4 text-base text-red-500">{errors.type?.message}</div>
					</div>
					<Controller
						control={control}
						name="type"
						render={({ field }) => (
							<Select isDisabled={!isAddMode} instanceId="type" options={type} {...field} />
						)}
					/>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row items-center flex-1 ">
						<label className="">Date</label>
						<div className="ml-4 text-base text-red-500">{errors.date?.message}</div>
					</div>
					<Controller
						control={control}
						name="date"
						render={({ field }) => (
							<DatePicker
								disabled={!isAddMode}
								placeholderText="Select Date..."
								className="border-[1px] border-gray-300 rounded-sm py-1 px-1"
								selected={field.defaultValue ? field.defaultValue : field.value}
								onChange={(date) => field.onChange(date)}
								maxDate={Date.now()}
								dateFormat="yyyy-MM-dd"
							/>
						)}
					/>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row items-center flex-1 ">
						<label className="">Category</label>
						<div className="ml-4 text-base text-red-500">{errors.category?.message}</div>
					</div>
					<Controller
						control={control}
						name="category"
						render={({ field }) => (
							<Select isDisabled={!isAddMode} instanceId="cat" options={cat} {...field} />
						)}
					/>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row items-center flex-1 ">
						<label>Item Name</label>
						<div className="ml-4 text-base text-red-500">{errors.itemName?.message}</div>
					</div>
					<input
						disabled={!isAddMode}
						className="input-text"
						name="itemName"
						placeholder="Iphone 12"
						type="text"
						{...register("itemName")}
					/>
				</div>
				<div className="flex flex-col">
					<div className="flex flex-row items-center flex-1 ">
						<label>Item Description</label>
						<div className="ml-4 text-base text-red-500">{errors.description?.message}</div>
					</div>
					<textarea
						disabled={!isAddMode}
						className="input-text"
						name="description"
						placeholder="Type your lost/found item description here..."
						rows="5"
						maxLength="2000"
						{...register("description")}
					/>
				</div>

				<label>Upload item images</label>
				<PhotoForm
					isAddMode={isAddMode}
					selectedImages={selectedImages}
					setSelectedImages={setSelectedImages}
				/>

				<div className="flex flex-col">
					<div className="flex flex-row items-center flex-1 ">
						<label>Email</label>
						<div className="ml-4 text-base text-red-500">{errors.email?.message}</div>
					</div>
					<input
						disabled={!isAddMode}
						className="input-text"
						name="email"
						placeholder="example@gmail.com"
						type="text"
						{...register("email")}
					/>
				</div>

				<label>Pick possible lost/found location</label>
				<MapForm isAddMode={isAddMode} setLocs={setLocs} locs={locs} />

				{!isExploreMode ? (
					<Fragment>
						<button
							disabled={formState.isSubmitting}
							className="px-6 py-2 border-2 border-transparent rounded-md w-[100px] bg-primary text-slate-100 hover:border-blue-400"
						>
							{formState.isSubmitting ? <Spinner /> : isAddMode ? "Submit" : "Delete"}
						</button>
						<button
							disabled={formState.isSubmitting}
							onClick={() => {
								reset();
								setRightSection(null);
							}}
							className="px-6 py-2 my-4 bg-blue-600 border-2 border-transparent rounded-md max-w-fit min-w-min text-slate-100 hover:border-blue-400"
						>
							Cancel
						</button>
					</Fragment>
				) : null}
			</form>
		</section>
	);
}

export default AddEdit;
