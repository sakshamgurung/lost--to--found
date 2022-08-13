import { useEffect, useState, useContext } from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { createAccount } from "../../lib/api-util";
import NotificationContext from "../../store/notification-context";
import { errorHandling } from "../../lib/error-handling";

function Register() {
	const router = useRouter();
	const [regSuccess, setRegSuccess] = useState(false);
	const notificationCtx = useContext(NotificationContext);

	const validationSchema = Yup.object().shape({
		name: Yup.string().required("Name is required"),
		email: Yup.string().required("Email is required").email("Invalid email"),
		password: Yup.string().required("Password is required"),
	});

	const { register, handleSubmit, formState, reset } = useForm({
		resolver: yupResolver(validationSchema),
	});
	const { errors } = formState;

	useEffect(() => {
		if (regSuccess) {
			reset();
			router.push("/account/login");
		}
	}, [regSuccess, reset]);

	async function onSubmit({ email, password, name }) {
		try {
			const data = await createAccount(name, email, password);
			if (data) {
				if (!data.accountExists) {
					setRegSuccess(true);
				} else {
					console.log("Email already exists");
					notificationCtx.showNotification({
						title: "Error!",
						message: "Email already exists",
						status: "error",
					});
				}
			}
		} catch (error) {
			notificationCtx.showNotification({
				title: "Error!",
				message: "Something went wrong!",
				status: "error",
			});
			errorHandling(error);
		}
	}

	return (
		<div className="m-auto max-w-[600px] mt-32">
			<section className="py-4 text-3xl font-medium text-center text-primary">
				Lost To Found
			</section>
			<section className="flex flex-col p-4 rounded-md shadow-md bg-slate-50">
				<h4 className="text-2xl text-gray-600">Register</h4>
				<form className="mt-1 text-xl font-light" onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col">
						<div className="flex flex-row items-center flex-1 ">
							<label>Name</label>
							<div className="ml-4 text-base text-red-500">{errors.name?.message}</div>
						</div>
						<input
							className="input-text"
							name="name"
							placeholder="John Doe"
							type="text"
							{...register("name")}
						/>
					</div>
					<div className="flex flex-col">
						<div className="flex flex-row items-center flex-1 ">
							<label>Email</label>
							<div className="ml-4 text-base text-red-500">{errors.email?.message}</div>
						</div>
						<input
							className="input-text"
							name="email"
							placeholder="example@gmail.com"
							type="text"
							{...register("email")}
						/>
					</div>
					<div>
						<div className="flex flex-row items-center flex-1 ">
							<label>Password</label>
							<div className="ml-4 text-base text-red-500">{errors.password?.message}</div>
						</div>
						<input
							className="input-text"
							name="password"
							placeholder="password"
							type="password"
							{...register("password")}
						/>
					</div>
					<div className="flex flex-col mt-3">
						<button
							disabled={formState.isSubmitting}
							className="px-6 py-2 rounded-md min-w-min bg-primary text-slate-100"
						>
							{formState.isSubmitting && <span>Loading...</span>}
							Register
						</button>

						<Link href="/account/login">
							<a className="mt-3 text-blue-500">Cancel</a>
						</Link>
					</div>
				</form>
			</section>
		</div>
	);
}

export default Register;
