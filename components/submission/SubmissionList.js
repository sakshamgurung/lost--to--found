import SubmissionItem from "./SubmissionItem";

function SubmissionList({ rightSection, setRightSection, data }) {
	return (
		<section className="flex flex-col m-6 text-gray-800 font-medium text-lg">
			<div className="flex flex-row justify-between text-left py-2 bg-primary text-slate-100">
				<div className="flex-[0.1] px-1">SN</div>
				<div className="flex-1 px-2">Item Name</div>
				<div className="flex-[0.2] px-2">Type</div>
			</div>
			{data != null ? (
				data.length != 0 ? (
					data.map((submission, index) => {
						return (
							<SubmissionItem
								key={index}
								submission={submission}
								index={index}
								selectedItem={rightSection}
								setItem={setRightSection}
							/>
						);
					})
				) : (
					<div className="flex flex-row justify-center mt-5">No submission</div>
				)
			) : null}
		</section>
	);
}

export default SubmissionList;
