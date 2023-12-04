import {useCollection} from '../hooks/useCollection.js'
import {Link} from 'react-router-dom'
import Avatar from './Avatar'
import {useHistory} from 'react-router-dom'


//styles
import './OnlineUsers.css'




export default function OnlineUsers({logginUser}) {
    const {error, documents} = useCollection('users')
    const history = useHistory()

    const handleClick = (e) => {
        history.push('/usermanager/adduser')
    }
    return (
        <div className='user-list'>
            <h2>All Users</h2>
            {error && <div className='error'>{error}</div>}
            {logginUser && logginUser.role === 'manager' && documents && 
            (<div>{documents.map(user => {
                return (
                    <Link key={user.id} className='user-list-item' to={`/usermanager/${user.id}`}>
                        {user.online && <span className='online-user'></span>}
                        <span>{user.displayName}</span>
                        <Avatar src={user.photoURL}/>
                    </Link>
                )
                
            })}
            <button className='btn add-user-btn' onClick={handleClick}>Add User</button>
            </div>
            )
            }
            
            {logginUser && logginUser.role === 'maintenance' && documents && documents.map(user => {
                return (
                    <div key={user.id} className='user-list-item'>
                        {user.online && <span className='online-user'></span>}
                        <span>{user.displayName}</span>
                        <Avatar src={user.photoURL}/>
                    </div>
                )
            })}
        </div>
    )
}
