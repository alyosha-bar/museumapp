import { useJsApiLoader } from "@react-google-maps/api";
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

    // const locations: Poi[] = [
    //     { key: 'bigBen', location: { lat: 51.5007292, lng: -0.1246254 } },
    //     { key: 'towerOfLondon', location: { lat: 51.5081124, lng: -0.0759493 } },
    //     { key: 'buckinghamPalace', location: { lat: 51.501364, lng: -0.14189 } },
    //     { key: 'londonEye', location: { lat: 51.5032973, lng: -0.1195537 } },
    //     { key: 'britishMuseum', location: { lat: 51.5194134, lng: -0.1269562 } },
    //     { key: 'trafalgarSquare', location: { lat: 51.508039, lng: -0.128069 } },
    //     { key: 'stPaulsCathedral', location: { lat: 51.5138453, lng: -0.0983515 } },
    //     { key: 'naturalHistoryMuseum', location: { lat: 51.496715, lng: -0.176367 } },
    //     { key: 'tateModern', location: { lat: 51.5075939, lng: -0.0993568 } },
    //     { key: 'hydePark', location: { lat: 51.5072682, lng: -0.1657303 } },
    //     { key: 'coventGarden', location: { lat: 51.511756, lng: -0.123041 } },
    //     { key: 'shard', location: { lat: 51.5045044, lng: -0.0865199 } },
    //     { key: 'oxfordStreet', location: { lat: 51.5144983, lng: -0.1465268 } },
    //     { key: 'camdenMarket', location: { lat: 51.5412885, lng: -0.1445944 } },
    //     { key: 'kewGardens', location: { lat: 51.4787433, lng: -0.2955083 } },
    // ];

    const [locations, setLocations] = useState<Poi[]>()


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
                    defaultZoom={11}
                    defaultCenter={ { lat: 51.509576038834986, lng: -0.1170313110403276 } }
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