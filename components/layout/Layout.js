import { useContext } from "react";

import AuthContext from "../../store/auth-context";
import NotificationContext from "../../store/notification-context";
import SideNav from "./SideNav";
import Notification from "../ui/notification";

function Layout(props) {
	const authCtx = useContext(AuthContext);
	const notificationCtx = useContext(NotificationContext);
	const activeNotification = notificationCtx.notification;

	return (
		<div>
			{authCtx.auth ? <SideNav /> : null}
			<main>{props.children}</main>
			{activeNotification && (
				<Notification
					title={activeNotification.title}
					message={activeNotification.message}
					status={activeNotification.status}
				/>
			)}
		</div>
	);
}

export default Layout;
