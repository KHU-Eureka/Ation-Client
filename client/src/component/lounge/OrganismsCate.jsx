import React from "react";

import { useFetch } from '../state';

function OrganismsCate() {
    const category = useFetch(`${process.env.REACT_APP_SERVER_HOST}/api/category/main`);

    return (
        <>
        {category !== undefined?
        <div className="OrganismsCate-Container">
            {category.map( cate => 
            <span className="category" key={cate.id} id={cate.id}>
                {cate.name}
            </span>
            )}
        </div>:<></>}
        </>
    )
}

export default OrganismsCate;