document.addEventListener('DOMContentLoaded', async () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // LOAD CMS DATA
    await loadCMSData();

    // Initialize Swiper for Hero Section AFTER data is loaded
    if (typeof Swiper !== 'undefined' && document.querySelector('.hero-swiper')) {
        const swiper = new Swiper('.hero-swiper', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            }
        });
    }
});

async function loadCMSData() {
    // Load Slider Data
    const sliderWrapper = document.getElementById('slider-wrapper');
    if (sliderWrapper) {
        try {
            const res = await fetch('/data/slider.json');
            if (res.ok) {
                const data = await res.json();
                let html = '';
                data.slides.forEach((slide, index) => {
                    if(index === 0 && !slide.title && !slide.description) {
                         // Full banner slide
                         html += `
                         <div class="swiper-slide" style="background: url('${slide.image}') center/contain no-repeat; cursor: pointer; background-color: #fff;">
                         </div>`;
                    } else {
                        // Text overlay slide
                        html += `
                        <div class="swiper-slide" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${slide.image}') center/cover;">
                            <div class="slide-content">
                                ${slide.title ? `<h2>${slide.title}</h2>` : ''}
                                ${slide.description ? `<p>${slide.description}</p>` : ''}
                            </div>
                        </div>`;
                    }
                });
                sliderWrapper.innerHTML = html;
            }
        } catch(e) { console.error('Error loading slider data', e); }
    }

    // Load Gallery Data
    const galleryWrapper = document.getElementById('gallery-wrapper');
    if (galleryWrapper) {
        try {
            const res = await fetch('/data/gallery.json');
            if (res.ok) {
                const data = await res.json();
                let html = '';
                data.images.forEach(img => {
                    html += `
                    <div class="gallery-item">
                        <img src="${img.image}" alt="${img.caption || img.category}">
                        <div class="gallery-overlay">
                            <h3>${img.caption || img.category}</h3>
                        </div>
                    </div>`;
                });
                galleryWrapper.innerHTML = html;
            }
        } catch(e) { console.error('Error loading gallery data', e); }
    }

    // Load Staff Data
    const yonetimWrapper = document.getElementById('staff-yonetim');
    const egitimciWrapper = document.getElementById('staff-egitimci');
    const belletmenWrapper = document.getElementById('staff-belletmen');
    
    if (yonetimWrapper || egitimciWrapper || belletmenWrapper) {
        try {
            const res = await fetch('/data/staff.json');
            if (res.ok) {
                const data = await res.json();
                
                let yonetimHtml = '';
                let egitimciHtml = '';
                let belletmenHtml = '';
                
                data.members.forEach(member => {
                    // Profile image or placeholder icon
                    const avatarContent = member.image 
                        ? `<img src="${member.image}" alt="${member.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`
                        : (member.type === 'Belletmen' 
                            ? `<i class="fas fa-user-graduate"></i>` 
                            : (member.type === 'Yönetim' ? `<i class="fas fa-user-tie"></i>` : `<i class="fas fa-chalkboard-teacher"></i>`));
                            
                    // Avatar background colors based on original design
                    const avatarStyle = member.type === 'Belletmen' ? 'background-color: #f0f7f4; color: #2e7d32;' : '';
                    const roleColor = member.type === 'Belletmen' ? 'color: #2e7d32;' : '';
                    const cardStyle = member.type === 'Yönetim' ? 'box-shadow: 0 15px 40px rgba(0,0,0,0.1); border-top: 5px solid var(--primary-color);' : '';
                    
                    const cardHtml = `
                    <div class="staff-card" ${cardStyle ? `style="${cardStyle}"` : ''}>
                        <div class="staff-avatar" ${avatarStyle ? `style="${avatarStyle}"` : ''}>
                            ${avatarContent}
                        </div>
                        <h3>${member.name}</h3>
                        <p ${roleColor ? `style="${roleColor}"` : ''}>${member.role}</p>
                    </div>`;
                    
                    if(member.type === 'Yönetim') yonetimHtml += cardHtml;
                    else if(member.type === 'Eğitimci') egitimciHtml += cardHtml;
                    else if(member.type === 'Belletmen') belletmenHtml += cardHtml;
                });
                
                if(yonetimWrapper) yonetimWrapper.innerHTML = yonetimHtml;
                if(egitimciWrapper) egitimciWrapper.innerHTML = egitimciHtml;
                if(belletmenWrapper) belletmenWrapper.innerHTML = belletmenHtml;
            }
        } catch(e) { console.error('Error loading staff data', e); }
    }
});
