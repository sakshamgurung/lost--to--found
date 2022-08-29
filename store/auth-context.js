import { useState, useEffect, createContext } from "react";

import { useRouter } from "next/router";

import { isAuth } from "../lib/account-api";

const AuthContext = createContext({
	auth: null,
	isUserAuthenticated: function (url) {},
});

export function AuthCtxProvider({ children }) {
	const [auth, setAuth] = useState(null);
	const router = useRouter();

	useEffect(() => {
		isUserAuthenticated(router.asPath);

		router.events.on("routeChangeComplete", isUserAuthenticated);

		return () => {
			router.events.off("routeChangeComplete", isUserAuthenticated);
		};
	}, []);

	function isUserAuthenticated(url) {
		console.log("Current url: ", url);
		const publicPaths = ["/account/login", "/account/register", "/account/success"];
		const path = url.split("?")[0];

		isAuth()
			.then((res) => {
				console.log("isAuth:", res);
				if (res.isAuth) {
					setAuth({ isAuth: true });
				} else {
					setAuth(null);
					if (!publicPaths.includes(path)) {
						router.push("/account/login");
					}
				}
			})
			.catch((error) => {
				console.log("error.type: ", error);
				setAuth(null);
				if (!publicPaths.includes(path)) {
					router.push("/account/login");
				}
			});
	}

	const context = {
		auth,
		isUserAuthenticated,
	};

	return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}

export default AuthContext;
