import React from "react"

//function needs to be Capital Letter in the first
const Rhs = () => {
    return (
        <>
        <div>
            <div class="form-floating" id="search-engine-div">
                <input class="form-control text-light" id="search-engine" placeholder="Search Tags"/>
                <label for="search-engine" class="d-flex align-items-md-center">
                    <img src="%PUBLIC_URL%/images/search.png" class="white-img" id="search-icon"/>
                    Search Twitter
                </label>
            </div>
        </div>
        </>
    )
}

export default Rhs