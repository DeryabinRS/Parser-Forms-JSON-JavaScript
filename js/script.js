window.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app');
    const navLinks =  document.querySelectorAll('.nav-link');

    navLinks.forEach( item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
        });
    });

    console.log(navLinks)
    let dataJson = {};

    async function assemblyForm(fileName){
        //get data from JSON
        const jsp = new JsonParser(`/json/${fileName}`);
        dataJson = await jsp.json

        //create card
        const card = document.createElement('div');
        card.classList.add('card');
        app.append(card);
        
        //create title card
        const card_title = document.createElement('div');
        card_title.classList.add('card-header');
        card_title.textContent = dataJson.name
        card.append(card_title)

        //create body card
        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card.append(card_body);

        //Create form
        const form = document.createElement('form');
        card_body.appendChild(form)
    }

    assemblyForm('addpost.js');
})