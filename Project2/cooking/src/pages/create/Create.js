import {useRef, useState, useEffect} from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useFetch } from "../../hooks/useFetch"
import "./Create.css"

export default function Create() {
    const [title, setTitle] = useState("")
    const [method, setMethod] = useState("")
    const [cookingTime, setCookingTime] = useState("")
    const [newIngredient, setNewIngredient] = useState("")
    const [ingredients, setIngredients] = useState([])
    const [image, setImage] = useState("")
    const ingredientInput = useRef(null)
    const history = useHistory()

    const {postData, data, error} = useFetch("http://localhost:3000/recipes", "POST")

   useEffect(() => {
    if(data){
       history.push("/") 
       history.go(0)
        
    }
   }, [data])

    const handleSubmit = (e) => {
        e.preventDefault()
        postData({title, ingredients, method, cookingTime: cookingTime + " minutes", image})
    }


    const handleAdd = (e) => {
        e.preventDefault()
        const ing = newIngredient.trim()

        if (ing && !ingredients.includes(ing)){
            setIngredients((prevIngredients) => [...prevIngredients, ing])
        }
        setNewIngredient("")
        // for cursor to focus on input field again
        ingredientInput.current.focus()
        
    }
  return (
    <div className="create">
        <h2 className="page-title">Add a New Recipe</h2>
        <form onSubmit={handleSubmit}> 
            <label>
                <span>Recipe title:</span>
                <input 
                    type = "text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                />
            </label>
            
            <label>
                <span>Recipe ingredients:</span>
                <div className="ingredients">
                    <input 
                        type="text/"
                        onChange={(e) => setNewIngredient(e.target.value)}
                        value={newIngredient}
                        ref = {ingredientInput}
                    ></input>
                    <button 
                        className="btn"
                        onClick={handleAdd}
                    >add</button>
                </div>
            </label>
            <p>Current ingredients: {ingredients.map((ingre) =>(
                <em key={ingre}>{ingre},</em>
            )

            )}</p>

            <label>
                <span>Recipe method:</span>
                <textarea
                    onChange={(e) => setMethod(e.target.value)}
                    value={method}
                    required
                ></textarea>
            </label>

            <label>
                <span>Cooking time (minutes):</span>
                <input 
                    type="number"
                    onChange={(e) => setCookingTime(e.target.value)}
                    value={cookingTime}
                    required
                ></input>
            </label>
            
            <label>
                <span>Recipe image:</span>
                <input 
                    type="text"
                    onChange={(e) => setImage(e.target.value)}
                    
                ></input>
            </label>


                <button className="btn">Submit</button>
        </form>
    </div>
  )
}
