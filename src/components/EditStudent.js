import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const EditStudent = (props)  => {
    const { parameter } = useParams();
    const history = useHistory();
    const [student, setStudent] = useState({id: -1, name: "", email: "", status: null, status_code: -1});

    useEffect(() => {
        // called once after intial render
        fetchStudent();
        }, [] )


    const fetchStudent = () => {
      fetch(`http://localhost:8080/student?email=${parameter}`)
      .then(response => response.json())
      .then(data => {
        setStudent(data);
      })
      .catch(err => console.log(err));
    }

    const updateStudentClick = async (e) => {
        e.preventDefault();

        await fetch (`http://localhost:8080/student/${student.id}`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify(student)
        })
       .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Student updated successfully');
        }) 
        .catch(err => console.error(err));
    
        history.push('/admin');
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudent ({
            ...student,
            [name]: value
        })
    }


    return (
        <div>
            <form onSubmit={updateStudentClick}>
                <label> Name: </label>
                <input type="text" id="name" name="name" value={student.name} onChange={handleInputChange}></input>
                
                <label> Email: </label> <br></br>
                <input type="text" id="email" name="email" value={student.email} onChange={handleInputChange}></input>
                <button id="submitButton" type="submit" > Update Student </button>
            </form>
        </div>                       
    )
}

export default EditStudent;