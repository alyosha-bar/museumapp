import { useState, useRef } from "react";
import SearchInput from "./SearchInput";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'


interface Location {
    lat: number;
    lng: number;
}


function ArtForm()  {

    const [name, setName] = useState<string>("");
    const [author, setAuthor] = useState<string>("");

    // The type for e is React.FormEvent<HTMLFormElement>
    const createPin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        if (inputref.current) {
            let places = inputref.current.getPlaces();
            
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
            
            // inputref.current = null
            setName("")
            setAuthor("")


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
      const data = response.json()
      console.log(data) // save the new version pins to the locations state

      // pass this data into the parent component - App.tsx
      // App.tsx passes is as props into the Map component
    }


    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
        libraries: ["places"]
    })

    const inputref = useRef<google.maps.places.SearchBox | null>(null);
    
    const handleOnPlacesChanged = () => {
        if (inputref.current) {
          let address = inputref.current.getPlaces()

          console.log(address)
        }
    };

    return (
        <>
          <form onSubmit={createPin}> {/* Pass the function directly */}
            <h3 className="form-title"> Create a new Art Piece</h3>
            <div className='label-group'>
              <label 
                htmlFor="name"> Name: </label>
              <input 
                type="text" 
                name="name"
                placeholder="Enter name" 
                value={name}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </div>
            <div className='label-group'>
              <label htmlFor="author"> Author/Artist: </label>
              <input 
                type="text" 
                name="author"
                placeholder="Enter author"
                value={author}
                onChange={(e : React.ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
              />
            </div>
            <div className='label-group'>
              <label htmlFor="address"> Address: </label>
              {isLoaded && 
                <StandaloneSearchBox
                    onLoad={(ref) => inputref.current = ref}
                    onPlacesChanged={handleOnPlacesChanged}
                >
                    <input type="text" placeholder="Enter address"/>
                </StandaloneSearchBox>
                }
            </div>
            <button type="submit"> Create Pin </button>
          </form>
        </>
      );
}

export default ArtForm;