import { useState, useRef } from "react";
import SearchInput from "./SearchInput";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api'


interface Location {
    lat: number;
    lng: number;
}

type Props = {
  check: () => void;
  handlePin: (e: React.FormEvent<HTMLFormElement>, name : string, author : string, inputref : google.maps.places.SearchBox | null) => void;
}

const ArtForm : React.FC<Props> = ( { check, handlePin } ) =>  {

    const [name, setName] = useState<string>("");
    const [author, setAuthor] = useState<string>("");


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
          {/* <button onClick={check}> Check Callback </button> */}
          <form onSubmit={(e) => 
            {
            handlePin(e, name, author, inputref.current)
            setName("")
            setAuthor("")
            }
            }> {/* Pass the function directly */}
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