const button = document.getElementById("search-btn");

button.addEventListener("click", search);

async function search(e){
    e.preventDefault();
    const data = {
        seller : document.getElementById("seller").value,
        debtor : document.getElementById("debtor").value,
        debtorLocation : document.getElementById("debtorLocation").value,
        performance : document.getElementById("performance").value,
        claimType : document.getElementById("claimType").value
    }
    const response = await fetch.post("/claims/search", {
        method: "POST",
        body: data
    });
    console.log("FROM FETCH: ", response.json);
    return response.json();
}