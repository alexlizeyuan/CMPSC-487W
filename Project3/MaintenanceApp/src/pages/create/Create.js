import {useState} from 'react'
import { useEffect } from 'react'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import {useHistory} from 'react-router-dom'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { useFirestore } from '../../hooks/useFirestore'
//styles
import './Create.css'



const categories = [
    {value: 'kitchen', label: 'Kitchen'},
    {value: 'bathroom', label: 'Bathroom'},
    {value: 'livingroom', label: 'Livingroom'},
    {value: 'bedroom', label: 'Bedroom'}
]

const serviceStatusOptions = [
    {value: 'pending', label: 'Pending'},
    {value: 'complete', label: 'Completed'}
]

export default function Create({logginUser}) {
    const [name, setName] = useState('')
    const [details, setDetails] = useState('')
    const [createdDate, setCreatedDate] = useState(null)
    const [category, setCategory] = useState('')
    const [assignedUsers, setAssignedUsers] = useState([])
    const [apartmentNumber, setApartmentNumber] = useState('')
    const [photo, setPhoto] = useState(null)
    const [photoError, setPhotoError] = useState('')
    const [serviceStatus, setServiceStatus] = useState(null)

    const {documents} = useCollection('users')
    const [users, setUsers] = useState([])
    const [formError, setFormError] = useState(null)
    const {user} = useAuthContext()
    const history = useHistory()
    const {addDocument, response} = useFirestore('requests')
    

    useEffect(() => {
        if (documents) {
            const options = documents.map(user =>{
                return {
                    value: user,
                    label: user.displayName
                }
            })
            const workers = options.filter(option => option.value.role === 'maintenance')
            setUsers(workers)
        }
        
    }, [documents])


    useEffect(() => {
        setCreatedDate(new Date().toISOString().slice(0, 10))
        
        if (logginUser && logginUser.role === 'tenant'){
            //initialize tenant's default values
            setApartmentNumber(logginUser.apartmentNumber)
        }
    },[])

    const handleFileChange = (e) => {
        setPhoto(null)
        let selected = e.target.files[0]

        if (!selected) {
            setPhotoError('Please select a file')
            return 
        } else if (!selected.type.includes('image')){
            setPhotoError('Please select an image file')
            return 
        } else if (selected.size > 10000000) {
            setPhotoError('Image size should be less than 10MB')
            return 
        }
        setPhotoError(null)
        setPhoto(selected)
        console.log('photo updated')
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError(null)
        if (!category) {
            setFormError('Please select a project category')
            return
        } 

        const createdBy = {
            id: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
        }
        
        const assignedUsersList = assignedUsers.map(user => {
            return {
                id: user.value.id,
                displayName: user.value.displayName,
                photoURL: user.value.photoURL
            }
        })

        const project = {
            name, 
            details,
            category: category.value,
            apartmentNumber,
            createdBy,
            assignedUsersList,
            serviceStatus: serviceStatus ? serviceStatus.value : 'pending',
            picURL: null,
            comments: []
        }

        const selectedDate = timestamp.fromDate(new Date(createdDate + " GMT-05:00"))
        const currentDate = timestamp.fromDate(new Date())
        let usingDate = null
        if (selectedDate.toDate().toISOString().slice(0, 10) === currentDate.toDate().toISOString().slice(0, 10)){
            usingDate = currentDate
        } else {
            usingDate = selectedDate
        }


        const res = await addDocument(project, usingDate, photo)
        if (!response.error){
            history.push('/')
        }

        
    }

  return (
    <div className='create-form'>
        <h2 className='page-title'>Create a New Request</h2>
        <form onSubmit={handleSubmit}>
            <label>
                <span>Request name:</span>
                <input
                    required
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </label>

            <label>
                <span>Request Description:</span>
                <textarea
                    required
                    type="text"
                    onChange={(e) => setDetails(e.target.value)}
                    value={details}
                ></textarea>
            </label>

            <label>
                <span>Request category:</span>
                <Select 
                    options={categories}
                    onChange={(option) => setCategory(option)}
                />
            </label>

            
            {logginUser && logginUser.role !== 'tenant' && 
            (<>
                <label>
                    <span>Request Apartment Number:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        value={apartmentNumber}
                    />
                </label>
                
                <label>
                        <span>Created Date:</span>
                        <input
                            type="date"
                            onChange={(e) => setCreatedDate(e.target.value)}
                            value={createdDate}
                        />
                </label>

                <label>
                    <span>Assign to:</span>
                    <Select
                        onChange={(option) => setAssignedUsers(option)}
                        options={users}
                        isMulti={true}
                    />
                </label>

                <label>
                    <span>Service Status:</span>
                    <Select
                        onChange={(option) => setServiceStatus(option)}
                        options={serviceStatusOptions}
                    />
                </label>
            </>
            )}

            {logginUser && logginUser.role === 'tenant' && 
            (<>
                <label>
                    <span>Request Apartment Number:</span>
                    <input
                        required
                        type="text"
                        onChange={(e) => setApartmentNumber(e.target.value)}
                        value={logginUser.apartmentNumber}
                        disabled
                    />
                </label>
                
                <label>
                    <span>Created Date:</span>
                    <input
                        type="date"
                        onChange={(e) => setCreatedDate(e.target.value)}
                        value={createdDate}
                        disabled
                    />
                </label>
            </>
            )}
                     
            <label>
                <span>Optional Photo:</span>
                <input 
                    type="file"
                    onChange={handleFileChange}
                />
                {photoError && <div className='error'>{photoError}</div>}
            </label>

            <button className='btn'>Submit Request</button>
            {formError && <div className='error'>{formError}</div>}

        </form>
    </div>
  )
}
