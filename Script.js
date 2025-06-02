
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });

        // Create floating particles
        function createParticles() {
            const hero = document.querySelector('.hero');
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                hero.appendChild(particle);
            }
        }

        // Project modal functionality
        const projectData = {
            ecommerce: {
                title: 'E-Commerce Platform',
                description: 'A comprehensive e-commerce solution built with modern technologies.',
                features: [
                    'User authentication and authorization',
                    'Product catalog with search and filtering',
                    'Shopping cart and checkout process',
                    'Payment integration with Stripe',
                    'Admin dashboard for inventory management',
                    'Order tracking and history',
                    'Responsive design for all devices'
                ],
                technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Bootstrap'],
                challenges: 'The main challenge was implementing secure payment processing and creating an intuitive admin interface for inventory management.',
                github: 'https://github.com/alexchen/ecommerce-platform',
                demo: 'https://ecommerce-demo.alexchen.dev'
            },
            taskmanager: {
                title: 'Task Management App',
                description: 'A collaborative task management application with real-time features.',
                features: [
                    'Real-time collaboration',
                    'Task assignment and tracking',
                    'Project organization',
                    'Team communication',
                    'Progress visualization',
                    'Mobile-responsive design',
                    'Offline functionality (PWA)'
                ],
                technologies: ['Vue.js', 'Firebase', 'Socket.io', 'Vuex', 'PWA', 'Chart.js'],
                challenges: 'Implementing real-time synchronization across multiple users while maintaining data consistency was the biggest technical challenge.',
                github: 'https://github.com/alexchen/task-manager',
                demo: 'https://tasks.alexchen.dev'
            },
            weatherapp: {
                title: 'Weather Dashboard',
                description: 'An interactive weather application with beautiful data visualizations.',
                features: [
                    'Current weather conditions',
                    '7-day weather forecast',
                    'Interactive weather maps',
                    'Historical weather data',
                    'Location-based services',
                    'Weather alerts and notifications',
                    'Data visualization charts'
                ],
                technologies: ['JavaScript', 'Chart.js', 'OpenWeather API', 'Geolocation API', 'CSS3', 'Local Storage'],
                challenges: 'Creating smooth animations for weather transitions and handling various weather data formats from different API endpoints.',
                github: 'https://github.com/alexchen/weather-dashboard',
                demo: 'https://weather.alexchen.dev'
            },
            portfolio: {
                title: 'Creative Portfolio',
                description: 'A modern, interactive portfolio website showcasing creative work.',
                features: [
                    'Smooth scroll animations',
                    'Interactive project galleries',
                    'Responsive design',
                    'Performance optimized',
                    'SEO friendly',
                    'Contact form integration',
                    'Social media integration'
                ],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Intersection Observer API', 'Service Workers'],
                challenges: 'Balancing visual appeal with performance optimization while ensuring accessibility across all devices.',
                github: 'https://github.com/alexchen/creative-portfolio',
                demo: 'https://portfolio.alexchen.dev'
            }
        };

        // Project card click handlers
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                const projectKey = this.getAttribute('data-project');
                const project = projectData[projectKey];
                
                if (project) {
                    showProjectModal(project);
                }
            });
        });

        function showProjectModal(project) {
            const modal = document.getElementById('projectModal');
            const modalBody = document.getElementById('modalBody');
            
            modalBody.innerHTML = `
                <h2 style="color: #333; margin-bottom: 1rem;">${project.title}</h2>
                <p style="color: #666; margin-bottom: 2rem; font-size: 1.1rem;">${project.description}</p>
                
                <h3 style="color: #333; margin-bottom: 1rem;">Key Features</h3>
                <ul style="color: #666; margin-bottom: 2rem; line-height: 1.8;">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                
                <h3 style="color: #333; margin-bottom: 1rem;">Technologies Used</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                
                <h3 style="color: #333; margin-bottom: 1rem;">Technical Challenges</h3>
                <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">${project.challenges}</p>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="${project.demo}" class="project-link" target="_blank">View Live Demo</a>
                    <a href="${project.github}" class="project-link" target="_blank">View Source Code</a>
                </div>
            `;
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        // Modal close functionality
        document.querySelector('.modal-close').addEventListener('click', closeModal);
        document.getElementById('projectModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        function closeModal() {
            document.getElementById('projectModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Escape key to close modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.skill-card, .project-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        // Initialize particles when page loads
        window.addEventListener('load', createParticles);

        // Add hover effects to project links
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-2px) scale(1)';
            });
        });

       // Add clipboard copy functionality to Email link
       function copyEmail() {
            const email = 'kenneth.johnson1992@outlook.com';

        navigator.clipboard.writeText(email)
            .then(() => {
            alert('Email copied to clipboard: ' + email);
            })
            .catch(err => {
            console.error('Failed to copy email:', err);
            alert('Failed to copy email. Please try again.');
            });
        }