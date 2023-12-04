import {Link} from 'react-router-dom'


//styles
import './ProjectList.css'
import Avatar from './Avatar'


export default function ProjectList({projects, logginUser}) {


  return (
    <div className='project-list'>
        {projects.length === 0 && <p>No projects yet!</p>}
        {projects.map(project => {
            return (
                <Link key={project.id} to={`/projects/${project.id}`}>
                    <h4>{project.name}</h4>
                    <p className='request-id'>Request ID: {project.id}</p>
                    <p>Requested on {project.createdAt.toDate().toDateString()}</p>
                    <div className='assigned-to'>
                        <ul>
                            {project.assignedUsersList.map(user => (
                                <li key={user.id}>
                                    <Avatar src={user.photoURL}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Link>
            )
        })}
        
    </div>
  )
}
