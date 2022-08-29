import { FaRegSadTear } from "react-icons/fa";
import { IoHandLeft } from "react-icons/io5";
import classNames from "classnames";

function SubmissionItem({ submission, index, selectedItem, setItem }) {
	return (
		<div
			onClick={() => setItem({ type: "submissionItem", id: submission.entityId, index: index })}
			className={classNames(
				"flex flex-row justify-between text-left py-3 cursor-pointer",
				{
					"hover:bg-blue-500 hover:text-slate-200 border-b-2 border-gray-300":
						selectedItem?.id !== submission.entityId,
				},
				{
					"bg-blue-500 text-slate-200 border-l-4 border-l-blue-700":
						selectedItem?.id === submission.entityId,
				}
			)}
		>
			<div className="flex-[0.1] px-1">{index + 1}</div>
			<div className="flex-1 text-lg px-2 text-ellipsis overflow-hidden whitespace-nowrap">
				{submission.itemName}
			</div>
			<div
				className={classNames(
					"flex-[0.2] flex flex-row items-center mx-2 px-2 py-1 rounded-md text-slate-200",
					{
						"bg-red-500": submission.type === "lost",
					},
					{
						"bg-green-500": submission.type === "found",
					}
				)}
			>
				{submission.type === "lost" ? <FaRegSadTear size={20} /> : <IoHandLeft size={20} />}
				<div className="ml-4">{submission.type}</div>
			</div>
		</div>
	);
}

export default SubmissionItem;
