import { useState, useEffect } from 'react'
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'


export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()

  const signup = async (email, password, displayName, phoneNumber, apartmentNumber, checkinDate, checkoutDate, role) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup

      const res = await projectAuth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not complete signup')
      }

      let imgUrl = ''
      if (role === 'manager'){
        imgUrl = await projectStorage.ref('common/profilePicture/manager.png').getDownloadURL()
      } else if (role === 'maintenance'){
        imgUrl = await projectStorage.ref('common/profilePicture/worker.jpg').getDownloadURL()
      } else if (role === 'tenant'){
        imgUrl = await projectStorage.ref('common/profilePicture/user.png').getDownloadURL()
      }
      

      // add display name to user
      await res.user.updateProfile({displayName, photoURL:imgUrl })

      //create a user document
      await projectFirestore.collection('users').doc(res.user.uid).set({
        online: true,
        displayName, 
        phoneNumber, 
        apartmentNumber, 
        checkinDate, 
        checkoutDate, 
        role, 
        photoURL:imgUrl
      })

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}