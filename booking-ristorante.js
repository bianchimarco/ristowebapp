// create an empty object
const Booking = {};
// retrieve the numero-persone-w wrapper
Booking.numeroPersoneW = document.getElementById('numero-persone-w');
// retrieve the "persone" span element
Booking.numeroPersone = document.getElementById('numero-persone');
// comment the tavoli div wrapper to recreate the tables with js and retrieve the tavoli-w wrapper
Booking.tavoliW = document.getElementById('tavoli-w');
// retrieve the 'tavolo-selezionato' id
Booking.tavoloSelezionato = document.getElementById('tavolo-selezionato');
// retrieve the message status id
Booking.messageStatus = document.getElementById('message-status');
// create a file sala.json to simulate the tables booking

(async function costruisciSala() {
    Booking.sala = await fetch('sala.json');
    Booking.sala = await Booking.sala.json();
   // console.log(Booking.sala);
    // console.log(Booking.sala.tavoli);
    Booking.tavoli = Booking.sala.tavoli;
    disponiTavoli(Booking.tavoli);
})();

// create function disponiTavoli
function disponiTavoli(tavoli) {
    tavoli.forEach((tavolo, i) => {
        let classiTavolo = 'tavolo';
        let tavoloDOM = document.createElement('div');
        tavoloDOM.appendChild(document.createTextNode(i + 1));
        classiTavolo += tavolo.occupato ? ' occupato' : ' libero';
       // si può scrivere anche così:  classiTavolo = classiTavolo + (tavolo.occupato ? ' occupato' : ' libero');
        classiTavolo += tavolo.posti == 6 ? ' x6' : ' x4';
        tavoloDOM.setAttribute('class', classiTavolo);
        Booking.tavoliW.appendChild(tavoloDOM);
    });
    
}

// manage the persons number
Booking.numeroPersoneW.addEventListener('click', (e) => {
    e.preventDefault();
    // retrieve numero persone
    let numeroPersone = +Booking.numeroPersone.textContent;
    // retrieve the user action (add or sub)
    if (e.target.id === 'add') {
        Booking.numeroPersone.textContent = numeroPersone + 1;
    } else if (e.target.id === 'sub' && numeroPersone > 1) {
        Booking.numeroPersone.textContent = numeroPersone - 1;
    }
});

// manage the tables booking
Booking.tavoliW.addEventListener('click', (e) => {
   let selezionato = e.target.textContent;
  // console.log(selezionato);
    if (Booking.tavoli[selezionato - 1].occupato) {
        Booking.messageStatus.textContent = `Il tavolo ${selezionato} è occupato`;
    } else {
        Booking.tavoloSelezionato.textContent = selezionato;
    }
});

// sending booking
document.forms[0].addEventListener('submit', (e) => {
   e.preventDefault();
   // checking if table is selected
    if (Booking.tavoloSelezionato.textContent == '-') {
        Booking.messageStatus.textContent = "è necessario selezionare un tavolo";
        return;
    }

    sendBooking();
});

function sendBooking() {
    let bookingForm = new FormData;
    // retrieve persons number and selected table
    bookingForm.append('numero-persone', +Booking.numeroPersone.textContent);
    bookingForm.append('tavolo-selezionato', +Booking.tavoloSelezionato.textContent);
    // retrieve form data
    bookingForm.append('nome', document.forms[0].nome.value);
    bookingForm.append('email', document.forms[0].email.value);
    // modifica
    const dati = Object.fromEntries(bookingForm.entries());
    fetchDati(dati).then(dati => console.log(dati));
    // fine modifica
    Booking.messageStatus.textContent = "Prenotazione effettuata con successo";
    document.forms[0].reset();
}

async function fetchDati(bookingForm) {
    let dati = await fetch('prenotazioni.php', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingForm)
    });
    return dati.json();
}