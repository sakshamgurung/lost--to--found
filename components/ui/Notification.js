import { useContext } from "react";

import classNames from "classnames";

import NotificationContext from "../../store/notification-context";

function Notification(props) {
	const notificationCtx = useContext(NotificationContext);

	const { title, message, status } = props;

	return (
		<div
			className={classNames(
				"fixed h-14 max-w-full top-0 left-0 right-0 mt-2 text-slate-100 py-2 px-[10%] rounded-md flex flex-col justify-between items-center",
				{ "bg-blue-500": status === "pending" },
				{ "bg-green-500": status === "success" },
				{ "bg-red-500": status === "error" }
			)}
			onClick={notificationCtx.hideNotification}
		>
			<h2 className="m-0 text">{title}</h2>
			<p>{message}</p>
		</div>
	);
}

export default Notification;
