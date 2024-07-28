document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactsCardContainer = document.getElementById('contactsCardContainer');
    const loginPage = document.getElementById('loginPage');
    const directoryPage = document.getElementById('directoryPage');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    let contacts = [];
    let editingIndex = null;

    const apiURL = 'https://script.google.com/macros/s/AKfycbx1IcMyEWdX4xD0Q6Q8t-SJkf52VY9_WhysFnFeq-uyfJIk7agFggazlwc1quq8OKdx/exec'; // Reemplaza <YOUR_SCRIPT_ID> con el ID de tu script de Google Apps Script

    const fetchContacts = async () => {
        const response = await fetch(`${apiURL}?action=getContacts`);
        contacts = await response.json();
        renderContacts();
    };

    if (sessionStorage.getItem('authenticated') === 'true') {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        contactForm.style.display = 'block';
    } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        contactForm.style.display = 'none';
    }

    loginButton.addEventListener('click', function() {
        loginPage.style.display = 'block';
        directoryPage.style.display = 'none';
    });

    logoutButton.addEventListener('click', function() {
        sessionStorage.removeItem('authenticated');
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        contactForm.style.display = 'none';
        renderContacts();
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'UNE2024' && password === 'UNE2024') {
            sessionStorage.setItem('authenticated', 'true');
            loginPage.style.display = 'none';
            directoryPage.style.display = 'block';
            loginButton.style.display = 'none';
            logoutButton.style.display = 'inline-block';
            contactForm.style.display = 'block';
            loginError.textContent = '';
            fetchContacts();
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos';
        }
    });

    const renderContacts = () => {
        contactsCardContainer.innerHTML = '';
        contacts.forEach((contact, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${contact.Photo}" alt="${contact.Name}">
                <div class="card-body">
                    <h5 class="card-title">${contact.Name}</h5>
                    <p class="card-text">${contact.Residence}</p>
                    <div class="card-icons">
                        ${sessionStorage.getItem('authenticated') === 'true' ? `
                        <button class="btn btn-sm btn-warning" onclick="editContact(${index})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteContact(${index})">Eliminar</button>
                        ` : ''}
                        <button class="btn btn-sm btn-info" onclick="showContactDetails(${index})" data-toggle="modal" data-target="#contactModal">Ver</button>
                    </div>
                </div>
            `;
            contactsCardContainer.appendChild(card);
        });
    };

    window.editContact = (index) => {
        const contact = contacts[index];
        document.getElementById('name').value = contact.Name;
        document.getElementById('gender').value = contact.Gender;
        document.getElementById('birthday').value = contact.Birthday;
        document.getElementById('photo').value = contact.Photo;
        document.getElementById('nationality').value = contact.Nationality;
        document.getElementById('birthplace').value = contact.Birthplace;
        document.getElementById('residence').value = contact.Residence;
        document.getElementById('bachelor').value = contact.Bachelor;
        document.getElementById('licenciature').value = contact.Licenciature;
        document.getElementById('master').value = contact.Master;
        document.getElementById('doctorate').value = contact.Doctorate;
        document.getElementById('secondDegree').value = contact.SecondDegree;
        document.getElementById('otherStudies').value = contact.OtherStudies;
        document.getElementById('domainCourse').value = contact.DomainCourse;
        document.getElementById('publications').value = contact.Publications;
        editingIndex = index;
    };

    window.deleteContact = async (index) => {
        const contactId = contacts[index].Name; // Usar un identificador único en vez de `Name`
        await fetch(`${apiURL}?action=deleteContact&id=${contactId}`, {
            method: 'POST'
        });
        fetchContacts();
    };

    window.showContactDetails = (index) => {
        const contact = contacts[index];
        const contactDetails = document.getElementById('contactDetails');
        contactDetails.innerHTML = `
            <p><strong>Nombre:</strong> ${contact.Name}</p>
            <p><strong>Género:</strong> ${contact.Gender}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${contact.Birthday}</p>
            <p><strong>Nacionalidad:</strong> ${contact.Nationality}</p>
            <p><strong>Lugar de Nacimiento:</strong> ${contact.Birthplace}</p>
            <p><strong>Residencia:</strong> ${contact.Residence}</p>
            <p><strong>Licenciatura:</strong> ${contact.Bachelor}</p>
            <p><strong>Maestría:</strong> ${contact.Master}</p>
            <p><strong>Doctorado:</strong> ${contact.Doctorate}</p>
            <p><strong>Segunda Especialidad:</strong> ${contact.SecondDegree}</p>
            <p><strong>Otros Estudios:</strong> ${contact.OtherStudies}</p>
            <p><strong>Dominio de Cursos:</strong> ${contact.DomainCourse}</p>
            <p><strong>Publicaciones:</strong> ${contact.Publications}</p>
        `;
    };

    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const newContact = {
            Name: document.getElementById('name').value,
            Gender: document.getElementById('gender').value,
            Birthday: document.getElementById('birthday').value,
            Photo: document.getElementById('photo').value,
            Nationality: document.getElementById('nationality').value,
            Birthplace: document.getElementById('birthplace').value,
            Residence: document.getElementById('residence').value,
            Bachelor: document.getElementById('bachelor').value,
            Licenciature: document.getElementById('licenciature').value,
            Master: document.getElementById('master').value,
            Doctorate: document.getElementById('doctorate').value,
            SecondDegree: document.getElementById('secondDegree').value,
            OtherStudies: document.getElementById('otherStudies').value,
            DomainCourse: document.getElementById('domainCourse').value,
            Publications: document.getElementById('publications').value
        };

        if (editingIndex !== null) {
            newContact.id = contacts[editingIndex].Name; // Usar un identificador único en vez de `Name`
            await fetch(`${apiURL}?action=editContact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(newContact)
            });
            editingIndex = null;
        } else {
            await fetch(`${apiURL}?action=addContact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(newContact)
            });
        }

        contactForm.reset();
        fetchContacts();
    });

    fetchContacts();
});
