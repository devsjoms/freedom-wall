fetch('/users')
    .then(response => response.json())
    .then(data => {

        const container = document.getElementById('messages');
        console.log(container)
        data.forEach(details => {

            container.innerHTML += `
            <div class = "mess">
                <h3>Message from ${details.name}</h3>
                <p>${details.message}</p>
            </div>
                `;

        });

    });

const btn = document.getElementById("close");
const opbtn = document.getElementById("open")
const modal = document.getElementById("modal");
opbtn.addEventListener("click", () =>{
    modal.style.display = "flex";
})
btn.addEventListener("click", () =>{
    modal.style.display = "none";
})