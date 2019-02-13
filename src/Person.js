import React from "react";
import "./App.css";

function Person(props) {
    const { name } = props
    return (
        <div className='person'>{name}</div>
    );
}

export default Person;
