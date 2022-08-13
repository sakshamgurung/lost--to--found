import Head from "next/head";

import "../styles/globals.css";
import { AuthCtxProvider } from "../store/auth-context";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
	return (
		<AuthCtxProvider>
			<Layout>
				<Head>
					<meta name="description" content="Lost to Found homepage" />
				</Head>
				<Component {...pageProps} />
			</Layout>
		</AuthCtxProvider>
	);
}

export default MyApp;
