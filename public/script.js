let socket = io();

// Button.
function submitClick() {
    // Sends the website entered from the input to server.
    socket.emit("website", document.getElementById('email').value);
}

// Receives the email.
function receiveEmail(emails) {
    // Displays the email client-side.
    for(let i = 0; i < emails.length; i++){
        let email = document.createElement("p");
        email.innerText = emails[i];
        document.getElementById('email-display').appendChild(email);
    }
    console.log(emails);
}

socket.on("emails", receiveEmail);