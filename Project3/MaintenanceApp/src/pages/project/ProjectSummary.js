import Avatar from "../../components/Avatar"
import { useFirestore } from "../../hooks/useFirestore"
import { useAuthContext } from "../../hooks/useAuthContext"
import {useHistory} from 'react-router-dom'
import Select from 'react-select'
import { useCollection } from "../../hooks/useCollection"
import { useEffect, useState } from "react"

import './ProjectSummary.css'

export default function ProjectSummary({project, logginUser}) {
    const history = useHistory()
    const [users, setUsers] = useState([])
    const [assignedUsers, setAssignedUsers] = useState([])

    const {documents} = useCollection('users')
    const {updateDocument} = useFirestore('requests')
    const {user} = useAuthContext()

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

    const handleChangeAssigned = (e) =>{
        
        const assignedUsersList = assignedUsers.map(user => {
            return {
                id: user.value.id,
                displayName: user.value.displayName,
                photoURL: user.value.photoURL
            }
        })

        updateDocument(project.id, {assignedUsersList})

    }

    const handleClick = (e) => {
        updateDocument(project.id, {serviceStatus: 'completed'})
    }

    return (
        <div>
            <div className="project-summary">
                <h2 className="page-title extra-title">{project.name}</h2>
                <div className="due-date">
                <p>Request ID: {project.id}</p>
                <p>Apartment Number: {project.apartmentNumber}</p>
                <p>Repair Area: {project.category}</p>
                <p>Requested on {project.createdAt.toDate().toDateString() + ' ' + project.createdAt.toDate().toTimeString().slice(0, 8)}</p>
                <p>By {project.createdBy.displayName}</p>
                </div>
                

                {project.picURL && (<img src={project.picURL} alt={project.name} />)}
                
                
                <div className="details">
                    <h4>Project Details:</h4>
                    {project.details}
                </div>

                {project.assignedUsersList.length > 0 && (
                    <div>
                        <h4>Project is assigned to:</h4>
                        <div className="assigned-users">
                        {project.assignedUsersList.map(user => {
                            return (
                                <div key={user.id}>
                                    <Avatar src={user.photoURL}/>
                                    <div className="worker-name">{user.displayName}</div>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                )}

                {logginUser && logginUser.role !== 'tenant' && (
                    <label>
                        <span>Assign to:</span>
                        <div className="extra-assigned">
                            <Select
                                onChange={(option) => setAssignedUsers(option)}
                                options={users}
                                isMulti={true}
                                className="select-field"
                            />
                            <button className="extra-btn" onClick={handleChangeAssigned}>Confirm</button>
                        </div>
                    </label>
                )}
                

                <div className="service-status">
                    <h4>Service Status:</h4>
                    {project.serviceStatus}
                </div>
                

                

            </div>
            {logginUser && logginUser.role !== 'tenant' && project.serviceStatus !== 'completed' && (
                <button className="btn" onClick={handleClick}>Mark as Complete</button>
            )}
        </div>
    )
}
