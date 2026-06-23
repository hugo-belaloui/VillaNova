async function fetchEvents() {
    try {
        const response = await fetch('https://api.openagenda.com/v2/agendas/21769447/events?key=1aa930631b0644dea161e24533698df9');
        const data = await response.json();
        const events = data.events;
        
        const container = document.getElementById('events-container');
        if (!container) return; // Security if not on main page
        
        // empty container before injecting
        container.innerHTML = '';

        events.forEach(event => {
            // create article card for an event
            const article = document.createElement('article');
            article.className = 'event-card';
            
            // image handling with fallback
            const imageUrl = event.image ? event.image.base + event.image.filename : 'https://placehold.co/400x300/E5E7EB/2A2A2A?text=Image+Non+Disponible';
            const imgAlt = event.title?.fr || 'Image de l\'événement';
            
            // create fig and image
            const figure = document.createElement('figure');
            figure.className = 'event-image';
            
            const picture = document.createElement('picture');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = imgAlt;
            img.loading = 'lazy';
            
            picture.appendChild(img);
            figure.appendChild(picture);
            
            // textual content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'event-content';
            
            
            const categorySpan = document.createElement('span');
            categorySpan.className = 'event-category';
            // default value of labels for open agenda
            categorySpan.textContent = event.keywords?.fr?.[0] || 'Événement';
            
            // title
            const titleH3 = document.createElement('h3');
            titleH3.className = 'event-title';
            titleH3.textContent = event.title?.fr || 'Titre non disponible';
            
            // place
            const locationP = document.createElement('p');
            locationP.className = 'event-location';
            locationP.textContent = event.locationName || 'Lieu non précisé';
            
            // date
            const dateP = document.createElement('p');
            dateP.className = 'event-date';
            // french format for the date
            const startDate = event.lastTiming?.begin || event.createdAt;
            if (startDate) {
                const dateObj = new Date(startDate);
                dateP.textContent = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            } else {
                dateP.textContent = 'Date non précisée';
            }
            
            // link "En savoir plus"
            const link = document.createElement('a');
            link.className = 'btn-primary';
            
            link.href = `event-detail.html?id=${event.uid}`;
            link.setAttribute('aria-label', `En savoir plus sur l'événement ${titleH3.textContent}`);
            link.textContent = 'En savoir plus';
            
            // assemble textual content
            contentDiv.appendChild(categorySpan);
            contentDiv.appendChild(titleH3);
            contentDiv.appendChild(locationP);
            contentDiv.appendChild(dateP);
            contentDiv.appendChild(link);
            
            // assemble article
            article.appendChild(figure);
            article.appendChild(contentDiv);
            
            // inject everything in dom 
            container.appendChild(article);
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        const container = document.getElementById('events-container');
        if (container) {
            container.innerHTML = '<p>Désolé, impossible de charger les événements pour le moment.</p>';
        }
    }
}

fetchEvents();