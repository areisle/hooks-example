import React, { useState, useEffect } from "react";
import Person from './Person';
import "./App.css";

let renders = 0;

const useSWAPI = (url) => {

    const pageSize = 10;
    const [ results, setResults ] = useState([]);
    const [next, setNext ] = useState(null);
    const [previous, setPrevious ] = useState(null);
    const [page, setPage ] = useState(1);
    const [count, setCount ] = useState(0);
    const [request, setRequest] = useState(null);

    const getNext = async () => {
        await getPage(next);
        setPage(page + 1)
    }

    const getPrevious = async () => {
        await getPage(previous);
        setPage(page - 1)
    }

    useEffect(() => {
        getPage(url);
        return () => request.abort();
    }, [])

    const getPage = async (requestUrl) => {

        if (!requestUrl) { return; }

        if (request) {
            request.abort();
            console.log('aborting request')
        }

        const newRequest = new AbortController();
        setRequest(newRequest);

        try {
            const result = await fetch(requestUrl, {
                signal: newRequest.signal,
            });

            if (!result.ok) {
                throw Error(result);
            }

            const { results, next, count, previous } = await result.json();

            setResults(results);
            setNext(next);
            setCount(count);
            setPrevious(previous);

        } catch (e) {
            console.error(e);
        }
    }

    return { 
        results, 
        pagination: {
            page, getNext, getPrevious, count,
            next, previous, pageSize,
        }
    };
}

const AppHook = (props) => {

    const { 
        results, 
        pagination: {
            page, getNext, getPrevious, count,
            next, previous, pageSize,
        }
    } = useSWAPI('https://swapi.co/api/people');
    console.log(++renders)
    return (
        <div className="App">
            {results.map(person => (<Person key={person.name} {...person}/>))}
            <div className='pagination'>
                <button 
                    onClick={getPrevious}
                    disabled={!previous}
                >
                    previous
                </button>
                <div className='pagination__count'>
                    showing {(page - 1) * pageSize  + 1} - {Math.min((page) * pageSize,  count || 0) } of {count}
                </div>
                <button 
                    onClick={getNext}
                    disabled={!next}
                >
                    next
                </button>
            </div>
        </div>
    );
}

export default AppHook;
