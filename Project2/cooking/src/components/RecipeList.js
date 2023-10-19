import "./RecipeList.css";
import { Link } from "react-router-dom";

export default function RecipeList({recipes}) {
    if (recipes.length === 0) {
        return (<div className="recipe-list">No recipes to display.</div>)
    }
    
  return (
    <div className="recipe-list">
        {recipes.map (recipe => (
            <div key={recipe.id} className = "card"> 
                <h3>{recipe.title}</h3>
                <p>{recipe.cookingTime} to make.</p>
                <div>{recipe.method.substring(0, 100)}...</div>
                <a href={`/recipes/${recipe.id}`}>Cook this</a>
            </div>
        ))}
    </div>
  )
}


