import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

/*import Post from "./post";
import MyForm from "./MyForm"


function App() {

    const [ initialValue, setInitialValue ] = useState(1234);

    const handleInitialValue = (event) => {
        setInitialValue(event.target.value);
    }

    return (
        <div>
            {initialValue} <br />

            <input onChange={handleInitialValue}/>

            <Post initValue={initialValue} changeParentHandler={setInitialValue} />
            <MyForm/>
        </div>
    );
}*/


function App() {

    const [dywidenda, setDywidenda] = useState("");

    const handleSubmit = (event) => {
        console.log(`Dane do wysłania ${dywidenda}`);
        event.preventDefault();

        axios.post('http://localhost:8090/api', {
            dywidenda: dywidenda
        })
    };

    return (
        <div>
            <input type='text' value={dywidenda} onChange={event => setDywidenda(event.target.value)}/><br/>

            <input type='submit' value='OK' onClick={handleSubmit}/>
        </div>
    );
}

export default App;
