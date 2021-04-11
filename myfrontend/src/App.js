import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

    const [wartosc, setWartosc] = useState("");
    const [rentownosc, setRentownosc] = useState("");
    const [posts, setPosts] = useState([]);

    const handleSubmit = (event) => {
        //console.log(`Dane do wysłania ${wartosc} ${rentownosc}`);
        event.preventDefault();

        axios.post('http://localhost:8090/api', {
            wartosc: wartosc,
            rentownosc: rentownosc
        })
    };

    const handleSubmitPobierz = (event) => {
        event.preventDefault();

        axios.get('http://localhost:8090/api').
        then(response => setPosts(response.data)).
        catch(error => console.log(error));
    };

    return (
        <>
            <div>
                Wartość: <input type='text' value={wartosc} onChange={event => setWartosc(event.target.value)}/>&emsp;
                Rentowność: <input type='text' value={rentownosc} onChange={event => setRentownosc(event.target.value)}/>&emsp;
                <input type='submit' value='Wyślij' onClick={handleSubmit}/>
            </div>
            <div>
                <input type='submit' value='Pobierz' onClick={handleSubmitPobierz}/><br/>
                <div className='new-line'>{posts}</div>
            </div>
        </>
    );
}

export default App;
