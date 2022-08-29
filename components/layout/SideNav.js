import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import { AiFillHome } from "react-icons/ai";
import { FaRegSadTear, FaMapMarkerAlt } from "react-icons/fa";
import { IoHandLeft } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

import { logout } from "../../lib/account-api";

function SideNav() {
	const router = useRouter();

	const handlesLogout = async () => {
		try {
			const res = await logout();
			if (!res.isAuth) {
				router.push("/account/login");
			}
		} catch (error) {
			console.log("logout error:", error.type);
		}
	};

	return (
		<nav className="fixed top-0 left-0 h-screen w-56 bg-slate-100 text-primary border-r-[1px] p-3 flex flex-col">
			<div className="border-b-[1px] border-gray-300">
				<Link href="/">
					<a>
						<h1 className="pb-4 text-2xl font-medium">Lost to Found</h1>
					</a>
				</Link>
			</div>
			<ul className="space-y-4 text-lg font-light">
				<li className="mt-4">
					<Link href="/">
						<a
							className={classNames("side-nav-anchor", {
								"text-slate-100 bg-primary": router.pathname === "/",
							})}
						>
							<AiFillHome size="20" className="mr-3" />
							<span>Home</span>
						</a>
					</Link>
				</li>
				<ul className="space-y-1 ">
					<li className="text-base font-medium text-opacity-90">
						<span>Explore</span>
					</li>
					<li>
						<Link href="/lost">
							<a
								className={classNames("side-nav-anchor", {
									"text-slate-100 bg-primary": router.pathname === "/lost",
								})}
							>
								<FaRegSadTear size="20" className="mr-3" />
								<span>Lost</span>
							</a>
						</Link>
					</li>
					<li>
						<Link href="/found">
							<a
								className={classNames("side-nav-anchor", {
									"text-slate-100 bg-primary": router.pathname === "/found",
								})}
							>
								<IoHandLeft size="20" className="mr-3" />
								<span>Found</span>
							</a>
						</Link>
					</li>
				</ul>
			</ul>
			<div className="absolute bottom-0 left-0 right-0 m-3 border-t-[1px] border-gray-300">
				<button className={classNames("side-nav-anchor min-w-full")} onClick={handlesLogout}>
					<MdLogout size="20" className="mr-3" />
					Logout
				</button>
			</div>
		</nav>
	);
}

export default SideNav;
