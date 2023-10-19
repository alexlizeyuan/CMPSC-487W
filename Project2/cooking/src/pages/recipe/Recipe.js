import "./Recipe.css"
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useFetch } from "../../hooks/useFetch";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function Recipe() {
    const { id } = useParams();
    const url = `http://localhost:3000/recipes/${id}/`
    const {data: recipe, isPending, error} = useFetch(url)
    const { deleteData , data} = useFetch(url, "DELETE")
    const history = useHistory()
    const handleDelete = () => {
        deleteData()
    }
    useEffect(() => {
        if(data){
           history.push("/") 
           history.go(0)
           
        }
       }, [data])
    return (
        <div className ="recipe">
            {error && (<p className="error">{error}</p>)}
            {isPending && <p className="loading">Loading...</p>}
            {recipe && (
                <>  
                    <h2 className="page-title">{recipe.title} - {recipe.id}</h2>
                    <p>Takes {recipe.cookingTime} to cook.</p>
                    <ul>
                        {recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}
                    </ul>
                    <p className="method">{recipe.method}</p>
                    <img src={recipe.image} width="800" height="880" alt={recipe.title} />

                </>
            )}
            <button onClick={handleDelete}>Delete This</button>
        </div>

    )
}
