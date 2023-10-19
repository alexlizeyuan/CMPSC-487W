import RecipeList from "../../components/RecipeList"
import { useFetch } from "../../hooks/useFetch"

import {useLocation} from "react-router-dom"

export default function Sort() {


    const url = `http://localhost:3000/recipes?_sort=title`

    const {error, isPending, data} = useFetch(url)
  return (
    <div>
        
        {error && <p className="error">{error}</p>}
        {isPending && <p className="loading">Loading...</p>}
        {data && <RecipeList recipes={data} />}
    </div>
  )
}
