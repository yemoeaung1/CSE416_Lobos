import axios from 'axios';

export const retrieveInfo = (setDataMapping) => {
    axios.get('http://localhost:8080/api/state-info')
    .then(response => {
        setDataMapping(response.data)

        console.log(response.data); 
    })
    .catch(error => {
        console.error("There was an error!", error);
    });
}