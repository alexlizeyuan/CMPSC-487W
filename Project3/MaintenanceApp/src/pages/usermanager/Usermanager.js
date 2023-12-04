import { useEffect, useState } from 'react'
import { updateDocument, useFirestore, deleteDocument } from '../../hooks/useFirestore'
import { projectStorage } from '../../firebase/config'

import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import Select from 'react-select'
import {useHistory} from 'react-router-dom'

//styles
import './Usermanager.css';




//styles


const rolesOption = [
    {value: 'tenant', label: 'Tenant'},
    {value: 'maintenance', label: 'Maintenance staff'},
    {value: 'manager', label: 'Manager'},
]

export default function Usermanager({logginUser}) {
    const {id} = useParams()
    const history = useHistory()
    const {document:editingUser} = useDocument('users', id)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const [displayName, setDisPlayName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [apartmentNumber, setApartmentNumber] = useState('')
    const [checkinDate, setCheckinDate] = useState('')
    const [checkoutDate, setCheckoutDate] = useState('')
    const [role, setRole] = useState('')
    const {updateDocument, deleteDocument} = useFirestore('users')

    

    useEffect(() => {
        if (editingUser) {
            setDisPlayName(editingUser.displayName)
            setPhoneNumber(editingUser.phoneNumber)
            setApartmentNumber(editingUser.apartmentNumber)
            setCheckinDate(editingUser.checkinDate)
            setCheckoutDate(editingUser.checkoutDate)
            setRole({value: editingUser.role, label: editingUser.role})
        }
    }, [editingUser])
   
    const updateUser = async() => {
        setError(null)
        setIsPending(true)

        try {
            let imgUrl = ''
            if (role.value === 'manager'){
                console.log('manager')
                imgUrl = await projectStorage.ref('common/profilePicture/manager.png').getDownloadURL()
            } else if (role.value === 'maintenance'){
                console.log('maintenance')
                imgUrl = await projectStorage.ref('common/profilePicture/worker.jpg').getDownloadURL()
            } else if (role.value === 'tenant'){
                console.log('tenant')
                imgUrl = await projectStorage.ref('common/profilePicture/user.png').getDownloadURL()
            }
            updateDocument(id, {displayName, phoneNumber, apartmentNumber, checkinDate, checkoutDate, role:role.value, photoURL:imgUrl })
            setIsPending(false)
        } catch (err) {
            console.log(err)
            setError(err.message)
            setIsPending(false)
        }
        
    }

    const deleteUser = async() => {
        setError(null)
        setIsPending(true)

        try {
            deleteDocument(id)
            setIsPending(false)
        } catch (err) {
            console.log(err)
            setError(err.message)
            setIsPending(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateUser()
    }

    const handleDelete = (e) => {
        e.preventDefault()

        if (logginUser.id === id){
            setError('You cannot delete yourself')
            return
        } else {
            deleteUser()
            history.push('/usermanager')
        }
    }


  return (
    <div className='usermanager'>
        <form className='auth-form'>
            <h2>Editing User</h2>
            <label>
                <span>Name:</span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setDisPlayName(e.target.value)}
                    value={displayName}
                />
            </label>

            <label>
                <span>Phone number:</span>
                <input 
                    type="number"
                    required
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber}
                />
            </label>

            <label>
                <span>Check-in Date:</span>
                <input
                    required
                    type="date"
                    onChange={(e) => setCheckinDate(e.target.value)}
                    value={checkinDate}
                />
            </label>

            <label>
                <span>Check-out Date:</span>
                <input
                    type="date"
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    value={checkoutDate}
                />
            </label>

            <label>
                <span>Apartment number:</span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    value={apartmentNumber}
                />
            </label>

            <label>
                <span>Role:</span>
                <Select
                    onChange={(option) => setRole(option)}
                    value={role}
                    options={rolesOption}
                />
            </label>

            {!isPending && <button className='btn editing-btn' onClick={handleSubmit}>Update</button>}
            {isPending && <button className='btn editing-btn' disabled>loading</button>}
            {!isPending && <button className='btn deleting-btn' onClick={handleDelete}>Delete</button>}
            {isPending && <button className='btn deleting-btn' disabled>loading</button>}
            {error && <div className='error'>{error}</div>}
            
        </form>
        
    </div>
  )
}
