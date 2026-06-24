async function fetchEventDetail() {
    try {
        // retrieve ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');

        const container = document.getElementById('event-detail-container');
        if (!container) return; 

        if (!eventId) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem;">Événement introuvable (ID manquant).</p>';
            return;
        }

        // call API to retrieve data of event
        const response = await fetch(`https://api.openagenda.com/v2/agendas/21769447/events?key=${OPENAGENDA_API_KEY}&uid[]=${eventId}`);
        const data = await response.json();
        
        let event = null;
        if (data.events && data.events.length > 0) {
            event = data.events[0]; // take first event
        }

        if (!event) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem;">Événement non trouvé.</p>';
            return;
        }

        // empty the container
        container.innerHTML = '';

        // create the dom dynamically
        
        // hero
        const imageUrl = event.image ? event.image.base + event.image.filename : 'https://placehold.co/1200x500/164A3B/FFF?text=Image+Non+Disponible';
        const imgAlt = event.title?.fr || 'Affiche de l\'événement';

        const figure = document.createElement('figure');
        figure.className = 'event-hero-image';
        
        const picture = document.createElement('picture');
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = imgAlt;
        img.width = 1200;
        img.height = 500;
        img.loading = 'lazy';
        
        picture.appendChild(img);
        figure.appendChild(picture);

        // event header
        const header = document.createElement('header');
        header.className = 'event-detail-header';

        const categorySpan = document.createElement('span');
        categorySpan.className = 'event-category';
        categorySpan.textContent = event.keywords?.fr?.[0] || 'Événement';

        const titleH1 = document.createElement('h1');
        titleH1.className = 'event-title';
        titleH1.textContent = event.title?.fr || 'Titre non disponible';

        const taglineP = document.createElement('p');
        taglineP.className = 'event-tagline';
        taglineP.textContent = event.description?.fr || '';

        header.appendChild(categorySpan);
        header.appendChild(titleH1);
        header.appendChild(taglineP);

        // -keyinfo date, place etc
        const keyInfoSection = document.createElement('section');
        keyInfoSection.className = 'event-key-info';
        keyInfoSection.setAttribute('aria-label', 'Informations clés');

        const ul = document.createElement('ul');
        
        // date
        const dateLi = document.createElement('li');
        const dateStrong = document.createElement('strong');
        dateStrong.textContent = 'Date';
        const dateText = document.createTextNode('');
        const startDate = event.lastTiming?.begin || event.createdAt;
        if (startDate) {
            const dateObj = new Date(startDate);
            dateText.textContent = ' ' + dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        } else {
            dateText.textContent = ' Non précisée';
        }
        dateLi.appendChild(dateStrong);
        dateLi.appendChild(document.createElement('br'));
        dateLi.appendChild(dateText);

        // time
        const timeLi = document.createElement('li');
        const timeStrong = document.createElement('strong');
        timeStrong.textContent = 'Heure';
        const timeText = document.createTextNode('');
        if (startDate) {
            const dateObj = new Date(startDate);
            timeText.textContent = ' ' + dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' });
        } else {
            timeText.textContent = ' Non précisée';
        }
        timeLi.appendChild(timeStrong);
        timeLi.appendChild(document.createElement('br'));
        timeLi.appendChild(timeText);

        // price
        const priceLi = document.createElement('li');
        const priceStrong = document.createElement('strong');
        priceStrong.textContent = 'Tarif';
        const priceText = document.createTextNode(' ' + (event.conditions?.fr || 'Gratuit'));
        priceLi.appendChild(priceStrong);
        priceLi.appendChild(document.createElement('br'));
        priceLi.appendChild(priceText);

        ul.appendChild(dateLi);
        ul.appendChild(timeLi);
        ul.appendChild(priceLi);
        keyInfoSection.appendChild(ul);

        // CTA
        const actionDiv = document.createElement('div');
        actionDiv.className = 'event-action';
        const reserveBtn = document.createElement('a');
        reserveBtn.href = event.registrationUrl || '#'; //only if sign in link exist 
        reserveBtn.className = 'btn-primary';
        reserveBtn.setAttribute('role', 'button');
        reserveBtn.textContent = 'Plus d\'informations';
        actionDiv.appendChild(reserveBtn);

        // page body 
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'event-body';

        const descSection = document.createElement('section');
        descSection.className = 'event-description';
        const descH2 = document.createElement('h2');
        descH2.textContent = 'À propos de cet événement';
        descSection.appendChild(descH2);
        

        const descContent = document.createElement('div');
        descContent.innerHTML = event.longDescription?.fr || event.description?.fr || '<p>Aucune description détaillée disponible.</p>';
        descSection.appendChild(descContent);

        const aside = document.createElement('aside');
        aside.className = 'event-practical-info';
        const asideH3 = document.createElement('h3');
        asideH3.textContent = 'Informations pratiques';
        const asideUl = document.createElement('ul');
        
        const locLi = document.createElement('li');
        const locStrong = document.createElement('strong');
        locStrong.textContent = 'Lieu : ';
        locLi.appendChild(locStrong);
        locLi.appendChild(document.createTextNode(event.location?.name || 'Non précisé'));
        
        const addressLi = document.createElement('li');
        const addressStrong = document.createElement('strong');
        addressStrong.textContent = 'Adresse : ';
        addressLi.appendChild(addressStrong);
        addressLi.appendChild(document.createTextNode(event.location?.address || 'Non précisée'));

        asideUl.appendChild(locLi);
        asideUl.appendChild(addressLi);
        aside.appendChild(asideH3);
        aside.appendChild(asideUl);

        bodyDiv.appendChild(descSection);
        bodyDiv.appendChild(aside);

        // assemble and inject in the dom
        container.appendChild(figure);
        container.appendChild(header);
        container.appendChild(keyInfoSection);
        container.appendChild(actionDiv);
        container.appendChild(bodyDiv);
        
        document.title = `${event.title?.fr} - VillaNova`;

    } catch (error) {
        console.error("Erreur lors de la récupération de l'événement :", error);
        const container = document.getElementById('event-detail-container');
        if (container) {
            container.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;">Désolé, une erreur est survenue lors du chargement de l\'événement.</p>';
        }
    }
}

// start when loading the page
fetchEventDetail();
