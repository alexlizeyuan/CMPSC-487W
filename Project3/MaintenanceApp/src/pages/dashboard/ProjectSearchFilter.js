
import { useState } from 'react'


export default function ProjectSearchFilter({searchTerm, changeSearchTerm}) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [apartmentNumber, setApartmentNumber] = useState('')
    

    const handleClick = () => {
        changeSearchTerm({'startDate': startDate, 'endDate': endDate, 'apartmentNumber': apartmentNumber})
    }

    return (
        <div className="project-search-filter">
            <nav>
            <div className="date-aptNum">
                <label>
                    <span className='start-date'>Starting Date:</span>
                    <input
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
                    />
                </label>
                <label>
                    <span className='end-date'>Ending Date:</span>
                    <input
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                    />
                </label>
                <input 
                    type="text"
                    placeholder="Apartment Number"
                    className='aptNum'
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    value={apartmentNumber}
                />
                <button onClick={handleClick} className='button'>Search</button>
                </div>
            </nav>
            
        </div>
    )
}
