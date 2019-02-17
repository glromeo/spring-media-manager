import React from 'react';

function toLevel(v = 0) {
    return v <= 25 ? "bg-danger" : v <= 50 ? "bg-warning" : v <= 75 ? "bg-info" : "bg-success";
}

export default function ProgressBar({value, total}) {
    const percentage = total ? value * 100 / total : 0;
    return (
        <div className="progress">
            <div className={`progress-bar ${toLevel(percentage)}`} role="progressbar"
                 style={{"width": percentage + "%"}}
                 aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
                {percentage}%
            </div>
        </div>
    );
}