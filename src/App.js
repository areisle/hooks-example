import React from "react";
import Person from './Person';
import "./App.css";

let renders = 0;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            people: [],
            page: 1,
            pageSize: 10,
            count: 0,
        }

    }

    async componentDidMount() {
        this.getPage('https://swapi.co/api/people');
    }

    getPage = async (url) => {

        if (!url) { return; }

        if (this.request) {
            this.request.abort();
            console.log('aborting request')
        }

        this.request = new AbortController();

        try {
            const result = await fetch(url, {
                signal: this.request.signal,
            });

            console.log(result)

            if (!result.ok) {
                throw Error(result);
            }

            const { results: people, next, count, previous } = await result.json();

            this.setState({
                people,
                count,
                next,
                previous,
            });

        } catch (e) {
            console.error(e);
        }  
    }

    nextPage = async () => {
        const { next, page } = this.state;
        await this.getPage(next);
        this.setState({
            page: page + 1,
        })
    }

    previousPage = async () => {
        const { previous, page } = this.state;
        await this.getPage(previous);
        this.setState({
            page: page - 1,
        })
    }

    componentWillUnmount() {
        this.request.abort();
    }

    render() {
        console.log(++renders)
        const { people, page, pageSize, count, next, previous } = this.state;
        return (
            <div className="App">
                {people.map(person => (<Person key={person.name} {...person}/>))}
                <div className='pagination'>
                    <button 
                        onClick={this.previousPage}
                        disabled={!previous}
                    >
                        previous
                    </button>
                    <div className='pagination__count'>
                        showing {(page - 1) * pageSize  + 1} - {Math.min((page) * pageSize,  count || 0) } of {count}
                    </div>
                    <button 
                        onClick={this.nextPage}
                        disabled={!next}
                    >
                        next
                    </button>
                </div>
            </div>
        );
    }
}

export default App;
