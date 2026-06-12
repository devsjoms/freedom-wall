fetch('/users')
    .then(async response => {

        if (!response.ok) {
            const text = await response.text();
            console.error(text);
            return [];
        }

        return response.json();
    })
    .then(data => {

        const container = document.getElementById('messages');

        data.forEach(details => {
            container.innerHTML += `
            <div class="mess">
                <h3>Message from ${details.name}</h3>
                <p>${details.message}</p>
            </div>
            `;
        });

    })
    .catch(err => {
        console.error("Error loading messages:", err);
    });

const btn = document.getElementById("close");
const opbtn = document.getElementById("open");
const modal = document.getElementById("modal");
btn.addEventListener("click", () =>{
    modal.style.display = "none";
})
opbtn.addEventListener("click", () =>{
    modal.style.display = "flex";
})