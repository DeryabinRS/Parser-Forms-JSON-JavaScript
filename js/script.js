window.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('#app');
    const navLinks =  document.querySelectorAll('.nav-link');

    navLinks.forEach( item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            getDataJson(e.target.innerText, e.target.dataset.href);
            app.innerHTML= ''
            navLinks.forEach(link => {
                link.classList.remove('active')
            })
            e.target.classList.add('active')
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

            id = `field_${index}`
            const mask = field?.input?.mask

            if(field.label){
                assemblyLabel(wrapper, field.label, id, mask);
            }

            assemblyInput(wrapper, field, id, index, mask)

        });
    }

    function assemblyLabel(wrapper, text, id, mask = null){
        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = text;
        if(mask){
            label.textContent += ` (${mask})`
        }
        wrapper.appendChild(label);
    }

    function assemblyInput(wrapper, field, id = '', idEl = 0, mask = ''){
        let input;
        if(field.input.type === 'number') field.input.type = 'text'
        switch(field.input.type){
            case 'checkbox':
                input = document.createElement('input'); 
                input.classList.add('form-check-input');
                break;
            case 'textarea':
                input = document.createElement('textarea'); 
                input.classList.add('form-control');
                break;
            case 'technology':
                input = assemblySelect(field.input, field.input.technologies, wrapper, idEl, 'Select items')
                break;
            case 'color':
                input = assemblyColor(field.input, wrapper)
                break;
            default:
                input = document.createElement('input');
                input.classList.add('form-control');
        }

        if(mask){
            const im = new Inputmask(mask);
            im.mask(input);
        }
        
        input.setAttribute('id', id);
        input.setAttribute('type', field.input.type);
        if(field.input.placeholder){
            input.setAttribute('placeholder', field.input.placeholder);
        }
        if(field.input.required){
            input.setAttribute('required', true);
        }
        if(field.input.filetype){
            const fileTypes = field.input.filetype.map(fileType => {
                switch(fileType){
                    case 'jpeg':
                        return 'image/jpeg'
                    case 'png':
                        return 'image/png' 
                    case 'pdf':
                        return 'application/pdf'     
                }
            })
            input.setAttribute('accept', fileTypes.join(', '));
        }
        

        wrapper.appendChild(input)
    }

    function assemblyColor(fieldSetting, wrapper){
        const colorbox = document.createElement('div');
        wrapper.appendChild(colorbox)
        if(Array.isArray(fieldSetting.colors)){
            fieldSetting.colors.forEach((item, index) => {
                const color = `<div style="background:${item}; width:80px; height:40px"></div>`
                assemblyCheckbox(colorbox, color, `color_${index}`, 'radio', 'color1');
            })
        }
        return colorbox;
    }

    function assemblyCheckbox (el, text, id = '', type = 'checkbox', name = '') {
        const selectedBox = document.createElement('div');
        selectedBox.classList.add('form-check')
        el.appendChild(selectedBox);

        const inputSelectedBox = document.createElement('input');
        inputSelectedBox.classList.add('form-check-input')
        inputSelectedBox.setAttribute('type', type);
        if(type = 'radio') inputSelectedBox.setAttribute('name', name)
        inputSelectedBox.setAttribute('id', id)
        selectedBox.appendChild(inputSelectedBox);

        const labelSelectedBox = document.createElement('label');
        labelSelectedBox.classList.add('form-check-label')
        labelSelectedBox.setAttribute('for', id)
        labelSelectedBox.innerHTML = text
        selectedBox.appendChild(labelSelectedBox);
        return selectedBox;
    }

    function assemblySelect(fieldSetting, valuesArray = [], wrapper, idEl = 0, firstOptionName = ''){
        const idSelect = `select_${idEl}`
        let input;
        const checkboxes = document.createElement('div');

        if(fieldSetting.multiple){
            input = document.createElement('div');
            checkboxes.classList.add('checkboxes' ,'mb-3');
            wrapper.after(checkboxes);
        }else{
            input = document.createElement('select');
        }

        input.setAttribute('id', idSelect);

        input.classList.add('form-select');


        if(firstOptionName){
            const firstOption = document.createElement('option');
            firstOption.innerHTML = firstOptionName;
            input.appendChild(firstOption)
        }

        valuesArray.forEach((item, index) => {
            const idOption = `${idSelect}_${index}`
            const option = document.createElement('option');
            option.setAttribute('value', index);
            if(fieldSetting.multiple){
                assemblyCheckbox(checkboxes, item, idOption)
            }else{
                console.log(item)
                option.innerHTML = item
                input.appendChild(option)
            }
        })


        let expanded = false;

        if(fieldSetting.multiple){
            input.addEventListener('click', (e) => {
                if (!expanded) {
                    checkboxes.style.display = "block";
                    expanded = true;
                  } else {
                    checkboxes.style.display = "none";
                    expanded = false;
                  }
            })
        }

        return input;
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