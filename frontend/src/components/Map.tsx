import { InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { 
    AdvancedMarker, 
    APIProvider, 
    Map, 
    MapCameraChangedEvent, 
    Pin
} from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react";


type Poi = { key: string, location: google.maps.LatLngLiteral };


function Markers() {
    const [locations, setLocations] = useState<Poi[]>()
    const [selectedLocation, setSelectedLocation] = useState<Poi | null>()

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("/api/pins", {
                method: "GET",
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data); // or set state with the response data

                // Transform the data to match the LatLngLiteral structure
                const formattedData: Poi[] = data.map((item: { key: string; lat: number; lng: number }) => ({
                    key: item.key,
                    location: { lat: item.lat, lng: item.lng }, // Transform lat/lng into LatLngLiteral
                }));

                setLocations(formattedData)
            } else {
                console.error('Error fetching data:', response.status);
            }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <div>
            {locations && locations.map((location) => (
                <AdvancedMarker
                    key={location.key}
                    position={location.location}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </div>
    )
}



function MapContainer() {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
        libraries: ["places"]
    });
        
    if ( !isLoaded ) {
        return (
            <div> Loading ... </div>
        )
    }

    return (
      <>
      {isLoaded && 
        <div className="map">
            <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>

                <Map
                    mapId={'449bde27d5cd97d2'}
                    defaultZoom={12}
                    defaultCenter={ { lat: 51.509576038834986, lng: -0.1040313110403276 } }
                    onCameraChanged={ (ev: MapCameraChangedEvent) =>
                      console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                    }
                >
                    <Markers></Markers>
                </Map>
            </APIProvider>
        </div> }
      </>
    );

}

export default MapContainer;