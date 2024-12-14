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

type Props = {
    locations: Poi[];
}

const Markers : React.FC<Props> = ( {locations}) => {

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



const MapContainer : React.FC<Props> = ( {locations}) => {

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
                    <Markers locations={locations}></Markers>
                </Map>
            </APIProvider>
        </div> }
      </>
    );

}

export default MapContainer;