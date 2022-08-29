import { useState, useRef, Fragment } from "react";

import Image from "next/image";

import { MdDelete } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

function PhotoForm({ isAddMode, selectedImages, setSelectedImages }) {
	const [disableImgUpload, setDisableImgUpload] = useState(false);
	const [zoomedImg, setZoomedImg] = useState(null);
	const [selectedImagesURL, setSelectedImagesURL] = useState([]);
	const browseBtn = useRef(null);

	const onSelectFile = (e) => {
		const selectedFile = e.target.files[0];
		const selectedFileUrl = URL.createObjectURL(selectedFile);

		if (selectedImages.length < 3) {
			if (selectedImages.length == 2) {
				setDisableImgUpload(true);
			}
			setSelectedImages((prevImages) => prevImages.concat(selectedFile));
			setSelectedImagesURL((prevImagesURL) => prevImagesURL.concat(selectedFileUrl));
		} else {
			alert("No more than 3 images allowed");
		}
	};

	function deleteHandler(imageIndex) {
		const newSelectedImages = selectedImages.filter((image, index) => index !== imageIndex);
		const newSelectedImagesURL = selectedImagesURL.filter((imageURL, index) => {
			if (index !== imageIndex) {
				return imageURL;
			} else {
				URL.revokeObjectURL(imageURL);
			}
		});

		if (newSelectedImages.length < 3) {
			setDisableImgUpload(false);
		}
		setSelectedImages(newSelectedImages);
		setSelectedImagesURL(newSelectedImagesURL);
	}

	return (
		<section>
			{isAddMode ? (
				<div className="flex flex-row">
					<input
						disabled={disableImgUpload}
						ref={browseBtn}
						className="hidden"
						type="file"
						name="images"
						accept="image/png, image/jpeg, image/webp"
						onChange={(e) => onSelectFile(e)}
					/>
					<button
						className=" bg-blue-600 hover:bg-blue-500 text-slate-200 p-2 ml-2 rounded-md"
						disabled={disableImgUpload}
						type="button"
						onClick={() => browseBtn.current.click()}
					>
						{`Upload ${selectedImagesURL.length}/3`}
					</button>
				</div>
			) : null}
			{zoomedImg != null ? (
				<Fragment>
					<div className="bg-gray-700 bg-opacity-70 fixed w-full h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
						<AiOutlineClose
							size={30}
							color="tomato"
							className="bg-gray-200 bg-opacity-70 rounded-md absolute cursor-pointer z-30 right-3 top-3"
							onClick={() => setZoomedImg(null)}
						/>
					</div>
					<div className="fixed w-1/2 h-2/3 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
						<Image src={zoomedImg} layout="fill" objectFit="contain" alt={zoomedImg} />
					</div>
				</Fragment>
			) : null}

			<div className="flex flex-row justify-around bg-slate-200 rounded-md m-2 w-full h-44 p-2">
				{selectedImages &&
					selectedImages.map((image, index) => {
						return (
							<div
								key={index}
								className="flex flex-row w-40 h-40 hover:border-2 border-slate-500 rounded-md overflow-clip p-2 group"
							>
								{isAddMode ? (
									<MdDelete
										size={26}
										color="tomato"
										type="button"
										onClick={() => deleteHandler(index)}
										className="absolute ml-[120px] -mt-2 z-10 cursor-pointer hidden group-hover:block"
									/>
								) : null}
								<div className="relative w-36 h-36">
									{isAddMode ? (
										<Image
											src={selectedImagesURL[index]}
											layout="fill"
											objectFit="contain"
											alt={selectedImagesURL[index]}
										/>
									) : (
										<Image
											src={image}
											layout="fill"
											objectFit="contain"
											alt={image}
											className="hover:cursor-pointer"
											onClick={() => setZoomedImg(image)}
										/>
									)}
								</div>
							</div>
						);
					})}
			</div>
		</section>
	);
}

export default PhotoForm;
