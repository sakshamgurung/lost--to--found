function ProgressBar({ title, percentage }) {
	return (
		<div class="w-full bg-slate-300 rounded-full">
			<div
				class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
				style={`width: ${percentage}%`}
			>
				{title}
			</div>
		</div>
	);
}

export default ProgressBar;
