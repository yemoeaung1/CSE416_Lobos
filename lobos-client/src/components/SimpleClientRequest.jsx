import axios from 'axios';

export const retrieveInfo = (state, setDataMapping) => {
    axios.get(`http://localhost:8080/api/state-info?state=${state}`)
    .then(response => {
        setDataMapping(response.data)

        console.log(response.data); 
    })
    .catch(error => {
        console.error("There was an error!", error);
    });
}