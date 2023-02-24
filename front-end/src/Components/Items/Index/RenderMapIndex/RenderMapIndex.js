import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import favicon from "../../../../Images/faviconmap.ico"
import SideBar from "../../../NavBar/Sidebar/SideBar"

const RenderMapIndex = ({ foundItems, user, authenticated }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
return <Map foundItems={foundItems}/>;
};
function Map({foundItems}) {
	const navigate = useNavigate()
  const center = useMemo(() => ({ lat: 40.790000, lng: -73.93520
	}), []);
	const options = useMemo(() => ({
		mapId: "1d546124b7083459",
		disableDefaultUI: true,
		clickableIcons: false
	 }), [])

	const [selected, setSelected] = useState(null)

  return (
    <div>
			{/* <SideBar/> */}
        <GoogleMap
					options={options}
          zoom={10.9}
          center={center}
          mapContainerClassName="w-screen h-screen"
				 >
					{foundItems.map((item, idx) => {
						return (
							<Marker
								key={idx}
								position={{lat: Number(item.latitude), lng: Number(item.longitude) }}
								onClick={() => {setSelected(item)}}
								title={`${item.itemname}`}
								icon={{ url: favicon }}
							/>
						)
					})}
					{selected !== null ? (<InfoWindow 
					onCloseClick={() => {setSelected(null)}} 
					position={{lat: Number(selected.latitude), lng: Number(selected.longitude)}}>
						<div>
							<h2>{selected.itemname}</h2>
							<h6>Status: {selected.status}</h6>
							<img alt='item-onMap' width='80px' height='80px' src={`${selected.itemimg}`}/>
							<p>Category: {selected.category ? `${selected.category}` : 'Missing!'}</p>
							<p>Description: {selected.description ? `${selected.description}` : 'Missing!'}</p>
							<Button
                variant="success"
                onClick={() => {
                  navigate(`/show/${selected.id}`);
                }}
              >
                More Info
              </Button>
						</div>
					</InfoWindow>) : null}
        </GoogleMap>
    </div>
  );
};

export default RenderMapIndex;
