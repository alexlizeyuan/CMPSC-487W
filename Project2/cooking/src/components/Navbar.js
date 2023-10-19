import { Link } from "react-router-dom/cjs/react-router-dom"
import "./Navbar.css"
import { useFetch } from "../hooks/useFetch"
import Searchbar from "./Searchbar"
import {useHistory} from "react-router-dom"
export default function Navbar() {
  // const {data, isPending, error} = useFetch("http://localhost:3000/recipes")
  const history = useHistory()
  const handleClick = () => {
    
    // data.sort((a, b) => {
    //   return a.title.localeCompare(b.title)
    // })
    history.push(`/sort`)
    history.go(0)
    // console.log(data)
  }

  return (
    <div className ="navbar">
        <nav>
            <a href="/" className = "brand"><h1>Delight Eat</h1></a>
            <button onClick={handleClick}>Sort</button>
            <Searchbar />
            <a href="/create"> <h1>Create Recipe</h1></a>
            

        </nav>
    </div>
  )
}
