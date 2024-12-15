import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"


function Navbar() {


    return (
        <nav>
            <h1> Museum App </h1>

            <ul className="nav-links">
            <SignedOut>
                <SignInButton>
                    <button className="sign-in"> Sign In </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
            </ul>
        </nav>
    )

}

export default Navbar