import React, { useState, useEffect } from "react";
import Person from './Person';
import "./App.css";

let renders = 0;

function App(props) {

    const pageSize = 10;
    const [people, setPeople ] = useState([]);
    const [next, setNext ] = useState(null);
    const [previous, setPrevious ] = useState(null);
    const [page, setPage ] = useState(1);
    const [count, setCount ] = useState(0);
    const [request, setRequest] = useState(null);

    useEffect(() => {
        getPage('https://swapi.co/api/people');
        return () => request.abort();
    }, [])

    const getPage = async (url) => {

        if (!url) { return; }

        if (request) {
            request.abort();
            console.log('aborting request')
        }

        const newRequest = new AbortController();
        setRequest(newRequest);

        try {
            const result = await fetch(url, {
                signal: newRequest.signal,
            });

            console.log(result)

            if (!result.ok) {
                throw Error(result);
            }

            const { results: people, next, count, previous } = await result.json();

            setPeople(people);
            setNext(next);
            setCount(count);
            setPrevious(previous);

        } catch (e) {
            console.error(e);
        }
    }

    const nextPage = async () => {
        await getPage(next);
        setPage(page + 1)
    }

    const previousPage = async () => {
        await getPage(previous);
        setPage(page - 1);
    }
    console.log(++renders)
    return (
        <div className="App">
            {people.map(person => (<Person key={person.name} {...person}/>))}
            <div className='pagination'>
                <button 
                    onClick={previousPage}
                    disabled={!previous}
                >
                    previous
                </button>
                <div className='pagination__count'>
                    showing {(page - 1) * pageSize  + 1} - {Math.min((page) * pageSize,  count || 0) } of {count}
                </div>
                <button 
                    onClick={nextPage}
                    disabled={!next}
                >
                    next
                </button>
            </div>
        </div>
    );
}

export default App;
