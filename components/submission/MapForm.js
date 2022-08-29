import { useState, useEffect } from "react";

import Map, { Marker, Popup } from "react-map-gl";
import { HiLocationMarker } from "react-icons/hi";
import "mapbox-gl/dist/mapbox-gl.css";

function MapForm({ isAddMode, setLocs, locs }) {
	const [selectedMarker, setSelectedMarker] = useState(null);
	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

	const addLocation = (e) => {
		if (isAddMode) {
			if (locs.length < 3) {
				const temp = _.clone(locs);
				temp.push({
					latitude: e.lngLat.lat,
					longitude: e.lngLat.lng,
				});
				setLocs(temp);
			} else {
				alert("No more than three locations");
			}
		}
	};

	const removeLocation = (index) => {
		const temp = locs.filter((loc, i) => {
			if (i !== index) {
				return loc;
			}
		});
		setSelectedMarker(null);
		setLocs(temp);
	};

	return (
		<div className="h-52 w-full rounded-md mt-4 mb-4">
			<Map
				mapboxAccessToken={mapboxToken}
				style={{ width: "100%", height: "208px" }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				initialViewState={{
					longitude: -100,
					latitude: 40,
					zoom: 3.5,
				}}
				onClick={(e) => addLocation(e)}
				onMouseOver={(e) => (e.target.getCanvas().style.cursor = "crosshair")}
			>
				{locs.length > 0
					? locs.map((loc, index) => {
							return (
								<Marker key={index} latitude={loc.latitude} longitude={loc.longitude}>
									<button
										disabled={!isAddMode}
										className="bg-transparent border-none cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											setSelectedMarker({ loc: loc, index: index });
										}}
										type="button"
									>
										{<HiLocationMarker size={30} color="tomato" />}
									</button>
								</Marker>
							);
					  })
					: null}
				{selectedMarker ? (
					<Popup
						offset={25}
						latitude={selectedMarker.loc.latitude}
						longitude={selectedMarker.loc.longitude}
						onClose={() => {
							setSelectedMarker(null);
						}}
					>
						<button
							className="bg-red-500 text-slate-200 px-2 py-1 rounded-sm font-custFont"
							type="button"
							disabled={!isAddMode}
							onClick={() => {
								removeLocation(selectedMarker.index);
							}}
						>
							Delete
						</button>
					</Popup>
				) : null}
			</Map>
		</div>
	);
}

export default MapForm;
