import { useEffect, useState } from "react";
import ArtForm from "../components/ArtForm";
import MapContainer from "../components/Map";


type Poi = { key: string, location: google.maps.LatLngLiteral };

function Home() {

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


    // The type for e is React.FormEvent<HTMLFormElement>
    const createPin = (e: React.FormEvent<HTMLFormElement>, name : string, author : string, current : google.maps.places.SearchBox | null) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        if (current) {
            let places = current.getPlaces();
            
            if (!places || places.length <= 0) {
                return
            }

            
            const place = places[0]; // Get the first place
            const location = place.geometry?.location; // Access the geometry's location
            let address = place.formatted_address

            if (!location) {
                return
            }
                
            let currentLat = location.lat()
            let currentLng = location.lng()

            console.log("Making fetch request...")
            const body = { 
                name: name,
                author: author,
                address: address,
                lat: currentLat,
                lng: currentLng
            }
            // console.log(`Name: ${name}, Author: ${author}, Address: ${address}, Lat: ${currentLat}, Lng: ${currentLng}`)
            savePin(body)


        }
    };
    
    
    const savePin = async (body : any) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        const response = await fetch("/api/pin", requestOptions)

        if (!response.ok) {
            throw new Error("Error saving pin.")
        }
        const data = await response.json()

        const formattedData: Poi[] = data.map((entry : any) => ({
            key: entry.name, // Use the 'name' field as the key
            location: {
              lat: entry.lat,
              lng: entry.lng,
            },
          }));
          
          console.log(formattedData);

        setLocations(formattedData)

    }
    


    return (
        <>
            <ArtForm 
                check={() => {console.log("Checking callback")}}
                handlePin={createPin}
            ></ArtForm>
            <MapContainer locations={locations || []}></MapContainer>
        </>
    )
} 

export default Home;