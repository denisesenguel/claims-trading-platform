console.log("Search.js executing")

const button = document.getElementById("search-btn");

button.addEventListener("click", (e)=>{
    const sortByInput = document.getElementById("sortBy").value;
    const sortAscending = document.getElementById("ascending").value;
    const sortDescending = document.getElementById("descending").value;
    const faceValueStartInput = document.getElementById("faceValueStart").value;
    const faceValueEndInput = document.getElementById("faceValueEnd").value;
    const debtorInput = document.getElementById("debtor").value;
    const debtorLocationInput = document.getElementById("debtorLocation").value;
    const claimTypeInput = document.getElementById("claimType").value
    const performanceInput = document.getElementById("performance").value;
    
    let sortOrder = sortAscending || sortDescending;
    let sortQuery;
    if (sortByInput && sortOrder) {
        sortQuery[`${sortByInput}`] = sortOrder;
    } else {
        sortQuery = {};
    }

    let queryArray = [];
    
    let faceValueRange = {};
    let faceValueQuery = {faceValue: faceValueRange}

    if (faceValueStartInput) {
        faceValueRange["$gte"] = faceValueStartInput;
    }
    if (faceValueEndInput) {
        faceValueRange["$lte"] = faceValueEndInput;
    }
    if (faceValueStartInput || faceValueEndInput) {
            queryArray.push(faceValueQuery);
    }
    if (debtorInput) {
        let debtorQuery = {debtor: debtorInput};
        queryArray.push(debtorQuery);
    }
    if (debtorLocationInput) {
        let debtorLocationQuery = {debtorLocation: debtorLocationInput};
        queryArray.push(debtorLocationQuery);
    }
    if (claimTypeInput) {
        let claimTypeQuery = {claimType: claimTypeInput};
        queryArray.push(claimTypeQuery);
    }
    if (performanceInput) {
        let performanceQuery = {performance: performanceInput};
        queryArray.push(performanceQuery);
    }
    if (queryArray.length === 0) {
        filterQuery = {};
    } else if (queryArray.length === 1) {
        filterQuery = queryArray[0];
    } else {
        filterQuery = {$and: queryArray}
    }
    let body = {sortQuery, filterQuery};
    search(e, body);
});

async function search(e, body){
    e.preventDefault();
    console.log("BODY: ", body, JSON.stringify(body));
    const response = await fetch("/claims/search", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    console.log("FROM FETCH: ", response);
    return;
}
