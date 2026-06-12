fetch('/users')
    .then(async response => {
        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = null;
        }

        if (!response.ok) {
            const errMsg = data && data.error ? data.error : `Server error ${response.status}`;
            const container = document.getElementById('messages');
            container.innerHTML = `<div class="error">Error loading messages: ${errMsg}</div>`;
            throw new Error(errMsg);
        }

        return data;
    })
    .then(data => {
        const container = document.getElementById('messages');
        if (!Array.isArray(data)) {
            console.error('Unexpected /users response:', data);
            container.innerHTML = `<div class="error">Unexpected response from server</div>`;
            return;
        }

        data.forEach(details => {
            container.innerHTML += `
            <div class = "mess">
                <h3>Message from ${details.name}</h3>
                <p>${details.message}</p>
            </div>
                `;
        });
    })
    .catch(err => {
        console.error('Failed to load users:', err);
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