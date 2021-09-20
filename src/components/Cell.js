import React from 'react';
import './Cell.css';

function Cell({ cellValue }) {
    
    return (
        <div className="cell">
            <div className={cellValue ? "content" : "content contentNull"}>
                {cellValue ? cellValue : ' '}
            </div>
        </div>
    )
};


export default Cell
