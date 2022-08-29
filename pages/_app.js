import Head from "next/head";

import "../styles/globals.css";
import { AuthCtxProvider } from "../store/auth-context";
import { NotificationContextProvider } from "../store/notification-context";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
	return (
		<AuthCtxProvider>
			<NotificationContextProvider>
				<Layout>
					<Head>
						<meta name="description" content="Lost to Found homepage" />
					</Head>
					<Component {...pageProps} />
				</Layout>
			</NotificationContextProvider>
		</AuthCtxProvider>
	);
}

export default MyApp;
