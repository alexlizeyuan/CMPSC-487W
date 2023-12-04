import { useReducer, useEffect, useState } from "react"
import { projectFirestore, timestamp, projectStorage } from "../firebase/config"


let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null }
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null}
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload }
    default:
      return state
  }
}

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // collection ref
  const reference = projectFirestore.collection(collection)

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add a document
  const addDocument = async (doc, createdAt, photo) => {
    dispatch({ type: 'IS_PENDING' })

    try {

      //set created Date
      if (createdAt === null){
        createdAt = timestamp.fromDate(new Date())
      }

      let imgUrl = null
      if (photo !== null){
        //upload photos separted by apartment number
        const uploadPath = `usersPictures/${doc.apartmentNumber}/${photo.name}`
        const img = await projectStorage.ref(uploadPath).put(photo)
        imgUrl = await img.ref.getDownloadURL()
      } 

      const addedDocument = await reference.add({ ...doc, createdAt })
      await addedDocument.update({picURL: imgUrl})

      
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      await reference.doc(id).delete()
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
    }
  }

  //update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' })
    
    try {
      const updatedDocument = await reference.doc(id).update(updates)
      dispatchIfNotCancelled({type: 'UPDATED_DOCUMENT', payload: updatedDocument})
      return updatedDocument
    } catch (error){
      dispatchIfNotCancelled({type: 'ERROR', payload: 'could not update'})
      return null
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument, updateDocument, response }

}
