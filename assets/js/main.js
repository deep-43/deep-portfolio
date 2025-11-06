// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initModal();
  initScrollAnimations();
  initMobileMenu();
  initHeaderScroll();
  initSmoothScrolling();
});

// Modal functionality
function initModal() {
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalLink = document.getElementById('modalLink');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Add click event to all project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.desc;
      modalLink.href = card.dataset.link || '#';
      
      // Show/hide live project link based on availability
      if (!card.dataset.link || card.dataset.link === '#') {
        modalLink.style.display = 'none';
      } else {
        modalLink.style.display = 'inline-block';
      }
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Add escape key listener
      const escapeHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    });
  });
  
  // Close modal functionality
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Remove focus from modal for better accessibility
    setTimeout(() => {
      const firstProjectCard = document.querySelector('.project-card');
      if (firstProjectCard) firstProjectCard.focus();
    }, 100);
  }
  
  // Close modal when clicking close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Close modal when clicking outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with fade-in class
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', 
        navLinks.classList.contains('active')
      );
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-btn')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(15, 23, 42, 0.95)';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.background = 'rgba(15, 23, 42, 0.9)';
      header.style.boxShadow = 'none';
    }
  });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Add loading state to buttons
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      if (this.href && this.href.includes('mailto:')) {
        return; // Don't add loading for mailto links
      }
      
      if (!this.href || this.href === '#' || this.getAttribute('type') === 'button') {
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.disabled = true;
        
        setTimeout(() => {
          this.textContent = originalText;
          this.disabled = false;
        }, 1500);
      }
    });
  });
});

// Add keyboard navigation for projects
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('projectModal');
    if (modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
  
  // Navigate projects with arrow keys when modal is open
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const modal = document.getElementById('projectModal');
    if (modal.classList.contains('active')) {
      e.preventDefault();
      const projects = Array.from(document.querySelectorAll('.project-card'));
      const currentProjectTitle = document.getElementById('modalTitle').textContent;
      const currentIndex = projects.findIndex(project => 
        project.dataset.title === currentProjectTitle
      );
      
      let nextIndex;
      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % projects.length;
      } else {
        nextIndex = (currentIndex - 1 + projects.length) % projects.length;
      }
      
      // Simulate click on next/previous project
      projects[nextIndex].click();
    }
  }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add current year to copyright
document.addEventListener('DOMContentLoaded', function() {
  const copyrightElement = document.querySelector('.copyright');
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.textContent = copyrightElement.textContent.replace('2025', currentYear);
  }
});
