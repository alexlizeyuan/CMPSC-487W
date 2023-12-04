import { useCollection } from '../../hooks/useCollection'
import ProjectFilter from './ProjectFilter'
import ProjectSearchFilter from './ProjectSearchFilter'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

// styles
import './Dashboard.css'
import ProjectList from '../../components/ProjectList'



export default function Dashboard({logginUser}) {
    const {documents, error} = useCollection('requests')

    const [currentFilter, setCurrentFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState({'startDate': null, 'endDate': null, 'apartmentNumber': null})
    const {user} = useAuthContext()

    const changeFilter = (newFilter) => {
        setCurrentFilter(newFilter)
    }

    const changeSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)
    }

    const filteredProjects = documents ? documents.filter((doc) => {
        switch (currentFilter){
            case 'all':
                return true
            case 'mine':
                let assignedToMe = false
                doc.assignedUsersList.forEach((u) =>{
                    if (user.uid === u.id){
                        assignedToMe = true
                    }
                })
                return assignedToMe || doc.createdBy.id === user.uid
            case 'kitchen':
            case 'bathroom':
            case 'livingroom':
            case 'bedroom':
                return doc.category === currentFilter

            case 'pending':
            case 'completed':
                return doc.serviceStatus === currentFilter

            default:
                return true
        }
    }) : null

    const projectsStartDate = filteredProjects ? filteredProjects.filter((doc) => {
        if (searchTerm.startDate === '' || searchTerm.startDate == null){
            return true
        } else{
            return doc.createdAt.toDate() >= new Date(searchTerm.startDate + " GMT -05:00")
        }
    }) : null

    const projectsEndDate = projectsStartDate ? projectsStartDate.filter((doc) => {
        if (searchTerm.endDate === '' || searchTerm.endDate === null){
            return true
        } else {
            return doc.createdAt.toDate() <= new Date(searchTerm.endDate + " GMT -28:59")
        }
    }) : null

    const projects = projectsEndDate ? projectsEndDate.filter((doc) => {
        if (searchTerm.apartmentNumber === '' || searchTerm.apartmentNumber === null){
            return true
        } else{
            return doc.apartmentNumber === searchTerm.apartmentNumber
        }
    }) : null


    return (
        <div>
            <h2 className='page-title'>Dashboard</h2>
            {error && <p className='error'>{error}</p>}
            {documents && 
                <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter}/>}
                <ProjectSearchFilter searchTerm={searchTerm} changeSearchTerm={changeSearchTerm}/>
            {projects && <ProjectList projects={projects} logginUser={logginUser} />}
            
        </div>
    )
}
