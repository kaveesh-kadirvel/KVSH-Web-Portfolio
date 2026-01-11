// Text phrases
const phrases = ['Web Developer', 'Kaveesh Kadirvel'];

// Typing speeds (ms)
const typingSpeed = 80;
const deletingSpeed = 40;
const pauseAfterTyped = 1000;
const pauseAfterDeleted = 300;

const el = document.getElementById('typewriter');
const wait = ms => new Promise(res => setTimeout(res, ms));

async function typeText(text) {
    for (let i = 0; i <= text.length; i++) {
        el.textContent = text.slice(0, i);
        await wait(typingSpeed);
    }
}

async function deleteText(text) {
    for (let i = text.length; i >= 0; i--) {
        el.textContent = text.slice(0, i);
        await wait(deletingSpeed);
    }
}

async function runLoop() {
    let index = 0;
    while (true) {
        const text = phrases[index % phrases.length];
        await typeText(text);
        await wait(pauseAfterTyped);
        await deleteText(text);
        await wait(pauseAfterDeleted);
        index++;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    runLoop();

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(item => {
        observer.observe(item);
    });

    const contactItems = document.querySelectorAll('.contact-form-wrapper, .info-box, .social-box');
    contactItems.forEach(item => {
        observer.observe(item);
    });

    navSlide();

    // Hackathon Modal Logic
    const modal = document.getElementById('hackathon-modal');
    if (modal) {
        const closeBtn = document.querySelector('.close-btn');
        const hackathonCards = document.querySelectorAll('.hackathon-card');

        // Elements to populate
        const modalTitle = document.getElementById('modal-title');
        const modalStatus = document.getElementById('modal-status');
        const modalProjectName = document.getElementById('modal-project-name');
        const modalDesc = document.getElementById('modal-desc');
        const modalTags = document.getElementById('modal-tags');

        hackathonCards.forEach(card => {
            card.addEventListener('click', () => {
                // Extract data
                const title = card.querySelector('.card-title').textContent;
                const badge = card.querySelector('.achievement-badge');
                const status = badge ? badge.textContent : 'Participant';
                const statusClass = badge ? (badge.parentElement.parentElement.parentElement.classList.contains('winner') ? 'winner' : (badge.parentElement.parentElement.parentElement.classList.contains('runner-up') ? 'runner-up' : '')) : '';

                // For description and project, we need to parse the innerHTML or textContent more carefully
                // The current HTML structure is: 
                // <p class="card-desc"><strong>Project: Name</strong><br>Details...</p>
                const descP = card.querySelector('.card-desc');
                let projectName = 'N/A';
                let projectDetails = 'No details available.';

                if (descP) {
                    // Split by <br> or newline
                    const parts = descP.innerHTML.split(/<br\s*\/?>/i);
                    if (parts.length > 0) {
                        // Extract project name from the first part, removing <strong> and Project: prefix
                        const projectPart = parts[0];
                        const match = projectPart.match(/Project:\s*(.*?)<\/strong>/) || projectPart.match(/Project:\s*(.*)/);
                        if (match) {
                            // strip html tags if any remain in the capture group (though regex above tries to catch inside strong)
                            // simpler approach: create a temp entry
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = projectPart;
                            projectName = tempDiv.textContent.replace('Project:', '').trim();
                        } else {
                            // Fallback if structure is different
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = projectPart;
                            projectName = tempDiv.textContent.trim();
                        }
                    }
                    if (parts.length > 1) {
                        // The rest is details
                        projectDetails = parts.slice(1).join('<br>').trim();
                    } else {
                        // If no breaks, maybe just text?
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = descP.innerHTML;
                        // Try to remove the project name part if it exists
                        let fullText = tempDiv.textContent;
                        if (fullText.includes(projectName)) {
                            // This is a bit fuzzy, let's rely on the clone
                        }
                    }
                }

                // Cleaner parsing approach:
                // 1. Get the strong tag content for project name
                const strongTag = descP.querySelector('strong');
                if (strongTag) {
                    projectName = strongTag.textContent.replace('Project:', '').trim();
                }

                // 2. Get the HTML content after the strong tag for details.
                const cloneP = descP.cloneNode(true);
                const strongInClone = cloneP.querySelector('strong');
                if (strongInClone) strongInClone.remove();

                // Get innerHTML to preserve lists and formatting
                projectDetails = cloneP.innerHTML.trim();


                const tags = card.querySelectorAll('.tag');

                // 3. Get images if any
                const cardImagesContainer = card.querySelector('.card-images');
                const gallerySection = document.getElementById('gallery-section');
                const modalGallery = document.getElementById('modal-images');

                if (cardImagesContainer && gallerySection && modalGallery) {
                    const images = cardImagesContainer.querySelectorAll('img');
                    if (images.length > 0) {
                        modalGallery.innerHTML = ''; // Clear previous
                        images.forEach(img => {
                            const newImg = img.cloneNode(true);
                            modalGallery.appendChild(newImg);
                        });
                        gallerySection.style.display = 'block';
                    } else {
                        gallerySection.style.display = 'none';
                    }
                } else if (gallerySection) {
                    gallerySection.style.display = 'none';
                }

                // Populate Modal
                modalTitle.textContent = title;
                modalStatus.textContent = status;

                // Reset classes for status styling in modal
                modalStatus.className = 'achievement-badge';
                // We can style it based on text content or pass a class from parent
                if (status === 'Winner') {
                    modalStatus.style.background = 'rgba(255, 215, 0, 0.2)';
                    modalStatus.style.color = '#ffd700';
                    modalStatus.style.border = '1px solid rgba(255, 215, 0, 0.4)';
                    modalStatus.style.boxShadow = '0 0 20px -5px #ffd700';
                } else if (status === 'Runner Up') {
                    modalStatus.style.background = 'rgba(192, 192, 192, 0.2)';
                    modalStatus.style.color = '#c0c0c0';
                    modalStatus.style.border = '1px solid rgba(192, 192, 192, 0.4)';
                    modalStatus.style.boxShadow = '0 0 20px -5px #c0c0c0';
                } else {
                    modalStatus.style.background = 'rgba(255, 255, 255, 0.1)';
                    modalStatus.style.color = '#fff';
                    modalStatus.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    modalStatus.style.boxShadow = 'none';
                }

                modalProjectName.textContent = projectName;
                modalDesc.innerHTML = projectDetails; // Use innerHTML to preserve line breaks if we kept them, or just text

                modalTags.innerHTML = ''; // Clear previous
                tags.forEach(tag => {
                    const newTag = tag.cloneNode(true);
                    modalTags.appendChild(newTag);
                });

                modal.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

});

const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach((link) => {
                    link.style.animation = '';
                });
            });
        });
    }
}
