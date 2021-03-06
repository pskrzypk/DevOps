import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

    const [wartosc, setWartosc] = useState("");
    const [rentownosc, setRentownosc] = useState("");
    const [posts, setPosts] = useState([]);
    const [id, setId] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('/api', {
            wartosc: wartosc,
            rentownosc: rentownosc
        })
    };

    const handleRemove = (event) => {
        event.preventDefault();

        axios.delete('/api', {
            params: {
                id: id
            }
        });
    };

    const handleUpdate = (event) => {
        event.preventDefault();

        axios.put('/api', {
            id: id,
            wartosc: wartosc,
            rentownosc: rentownosc
        })
    };

    const handleSubmitPobierz = (event) => {
        event.preventDefault();

        if (!id){
            axios.get('/api').
            then(response => setPosts(response.data)).
            catch(error => console.log(error));
        }
        else {
            axios.get('/api', {
                params: {
                    id: id
                }
            }).
            then(response => setPosts(response.data)).
            catch(error => console.log(error));
        }
    };

    return (
        <>
            <div>
                Id: <input type='text' value={id} onChange={event => setId(event.target.value)}/>&emsp;
                <input type='submit' value='Usuń' onClick={handleRemove}/><br/><br/>
                Wartość: <input type='text' value={wartosc} onChange={event => setWartosc(event.target.value)}/>&emsp;
                Rentowność: <input type='text' value={rentownosc} onChange={event => setRentownosc(event.target.value)}/>&emsp;
                <input type='submit' value='Dodaj' onClick={handleSubmit}/>&emsp;
                <input type='submit' value='Aktualizuj' onClick={handleUpdate}/><br/><br/>
                <input type='submit' value='Pobierz' onClick={handleSubmitPobierz}/>&emsp;
                <div className='new-line'>{posts}</div>
            </div>
        </>
    );
}


export default App;
