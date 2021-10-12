window.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app');
    const navLinks =  document.querySelectorAll('.nav-link');

    navLinks.forEach( item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            getDataJson(e.target.innerText, e.target.dataset.href);
            app.innerHTML= ''
        });
    });

    let dataJson = {};

    async function getDataJson(formName, fileName){
        //get data from JSON
        const jsp = new JsonParser(`./json/${fileName}`);
        dataJson = await jsp.json

        assemblyForm(formName)
        //create card
    }

    function assemblyForm (formName) {

        const card = document.createElement('div');
        card.classList.add('card');
        app.append(card);
        
        //create title card
        const card_title = document.createElement('div');
        card_title.classList.add('card-header');
        card_title.innerHTML = `<b>${formName}</b>`
        card.append(card_title)

        //create body card
        const card_body = document.createElement('div');
        card_body.classList.add('card-body');
        card.append(card_body);

        //Create form
        const form = document.createElement('form');
        card_body.appendChild(form)

        if(dataJson?.fields){
            assemblyFields(card_body, dataJson.fields);
        }

        if(dataJson?.references){
            assemblyReferences(card_body, dataJson.references);
        }
        if(dataJson?.buttons){
            assemblyButtons(card_body, dataJson.buttons);
        }
    }

    function assemblyFields(block, fields){
        fields.forEach((field, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('mb-3');
            block.appendChild(wrapper);

            id = field?.label?.toLowerCase().replace(/\s/g, '_',)
            if(field.label){
                assemblyLabel(wrapper, field.label, id);
            }
            assemblyInput(wrapper, field, id)

        });
    }

    function assemblyLabel(wrapper, text, id){
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = text;
        wrapper.appendChild(label);
    }

    function assemblyInput(wrapper, field, id = ''){
        const input = document.createElement('input');
        input.setAttribute('id', id);
        input.setAttribute('type', field.input.type);
        if(field.input.placeholder){
            input.setAttribute('placeholder', field.input.placeholder);
        }
        if(field.input.type === 'checkbox'){
            input.classList.add('form-check-input')
        }else{
            input.classList.add('form-control')
            if(field.input.type === 'color'){
                input.classList.add('form-control-color')
            }
        }
        wrapper.appendChild(input)
    }

    function assemblyRef(wrapper, field){
        const ref = document.createElement('div');
        wrapper.appendChild(ref)

        if(Object.keys(field).includes('text without ref')){
            const span = document.createElement('span');
            span.innerText = field['text without ref'] + ' ';
            ref.appendChild(span)
        }

        if(Object.keys(field).includes('ref')){
            const href = document.createElement('a');
            href.setAttribute('href',field.ref);
            href.innerText = field.text;

            ref.appendChild(href)
        }

        wrapper.appendChild(ref)
    }

    function assemblyReferences(block, references){
        references.forEach((field, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('mb-3', 'me-3', 'd-inline-block');
            block.appendChild(wrapper);
            
            if(Object.keys(field).includes('ref')){
                assemblyRef(wrapper, field)
            }

            if(Object.keys(field).includes('input')){
                assemblyInput(wrapper, field)
            }

        });
    }

    function assemblyButtons(block, buttons){
        const wrapper = document.createElement('div');
        block.appendChild(wrapper);
        buttons.forEach((field, index) => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-success', 'me-2')
            button.innerText = field.text;
            wrapper.appendChild(button)
        })
    }

    getDataJson('Add Post', 'addpost.js');
})