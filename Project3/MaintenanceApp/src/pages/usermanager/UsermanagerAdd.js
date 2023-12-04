import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useLogout } from '../../hooks/useLogout'



const rolesOption = [
    {value: 'tenant', label: 'Tenant'},
    {value: 'maintenance', label: 'Maintenance staff'},
    {value: 'manager', label: 'Manager'},
]

export default function UsermanagerAdd() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [disPlayName, setDisPlayName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [apartmentNumber, setApartmentNumber] = useState('')
    const [checkinDate, setCheckinDate] = useState('')
    const [checkoutDate, setCheckoutDate] = useState('')
    const [role, setRole] = useState('')
    const {user} = useAuthContext()
    const {signup, isPending, error} = useSignup()
    const {logout} = useLogout()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (user !== null){
            logout()
        }
        signup(email, password, disPlayName, phoneNumber, apartmentNumber, checkinDate, checkoutDate ? checkoutDate : null, role.value)
    }


  return (
        <form className='auth-form' onSubmit={handleSubmit}>
            <h2>Add New User</h2>
            <label>
                <span>Email:</span>
                <input 
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </label>

            <label>
                <span>Password:</span>
                <input 
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
            </label>

            <label>
                <span>Name:</span>
                <input 
                    type="text"
                    required
                    onChange={(e) => setDisPlayName(e.target.value)}
                    value={disPlayName}
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
                    options={rolesOption}
                />
            </label>

            {!isPending && <button className='btn'>Sign Up</button>}
            {isPending && <button className='btn' disabled>loading</button>}
            {error && <div className='error'>{error}</div>}
            
        </form>
  )
}
