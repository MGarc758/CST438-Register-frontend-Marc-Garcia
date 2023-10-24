import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const AdminHome = ()  => {
    const history = useHistory();
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({name:"", email:""});

    const jwtToken = sessionStorage.getItem('jwt');

    useEffect(() => {
        // called once after intial render
        fetchStudents();
        }, [] )


    const fetchStudents = () => {
      fetch('http://localhost:8080/students', {
        headers: {
          'Authorization': jwtToken
        }
      })
      .then(response => response.json())
      .then(data => {
        setStudents(data);
      })
      .catch(err => console.log(err));
    }

    const onEditClick = (parameter) => {
      history.push(`/edit/${parameter}`);
    }

    const onDeleteClick =async (id) => {
      await fetch (`http://localhost:8080/student/${id}`, 
        {
          headers: {
            'Authorization': jwtToken
          },
          method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Student deleted successfully');
        })
        .catch(err => console.error(err));

        window.location.reload();
    }

    const onAddStudent = async (e) => {
      e.preventDefault();

      await fetch (`http://localhost:8080/students/add/${newStudent.name}/${newStudent.email}`, 
        {
          headers: {
            'Authorization': jwtToken
          },
          method: 'POST',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Student added successfully');
        })
        .catch(err => console.error(err));

        window.location.reload();
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewStudent ({
          ...newStudent,
          [name]: value
      })
  }

    const headers = ['Edit', 'Name', 'Email', 'Delete'];  

    return (
      <div margin="auto" >
      <table className="Center"> 
        <thead>
          <tr>
            {headers.map((title, idx) => (<th key={idx}>{title}</th>))}
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td><button id={student.name + " button"} onClick={() => onEditClick(student.email)}> Edit </button></td>
              <td id={student.name}>{student.name}</td>
              <td id={student.email}>{student.email}</td>
              <td><button id={student.name + " delete"} onClick={() => onDeleteClick(student.id)}> Delete </button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <br></br> <br></br>
      <h3>Add Student</h3> <br></br>
      <form onSubmit={onAddStudent}>
          Name: <input type="text" id="name" name="name" onChange={handleInputChange} placeholder='Enter name here' ></input>
          <br></br>
          Email: <input type="text" id="email" name="email" onChange={handleInputChange} placeholder='Enter email here' ></input>
          <button id='addStudentButton' type="submit"> Add Student </button>
      </form>
    </div>
    );
}

export default AdminHome;