/**
 * BAITO Photobooth Collection Viewer
 * @version 1.0.1
 * 
 * This script handles loading and displaying photos from URL parameters
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title') || 'Photo Collection';
    const photoParam = urlParams.get('photos');
    
    // Set collection title
    document.getElementById('collection-title').textContent = title;
    document.title = title + ' - BAITO Photobooth';
    
    // Create modal elements for fullscreen view
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="modal-content">
            <img class="modal-image" src="" alt="Full size photo">
        </div>
    `;
    document.body.appendChild(modal);
    
    // Modal close functionality
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('open');
    });
    
    // Also close by clicking anywhere in the modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });
    
    // Parse photos parameter
    if (!photoParam) {
        showError('No photos were found in this collection.');
        return;
    }
    
    let photoUrls = [];
    try {
        // Try parsing as JSON
        photoUrls = JSON.parse(photoParam);
    } catch (e) {
        // If not JSON, try as comma-separated list
        photoUrls = photoParam.split(',');
    }
    
    if (!Array.isArray(photoUrls) || photoUrls.length === 0) {
        showError('Invalid photo collection format.');
        return;
    }
    
    // Load the photos
    loadPhotos(photoUrls);
});

/**
 * Load and display photos in the grid
 */
function loadPhotos(photoUrls) {
    const photoGrid = document.getElementById('photo-grid');
    const loadingElement = document.getElementById('loading');
    
    // Track loaded photos for showing/hiding loading indicator
    let loadedCount = 0;
    const totalPhotos = photoUrls.length;
    
    // Loop through each photo URL
    photoUrls.forEach((url, index) => {
        // Create photo card element
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        
        // Get filename from URL
        const filename = getFilenameFromUrl(url);
        
        // Add card HTML
        photoCard.innerHTML = `
            <div class="photo-container">
                <img class="photo-image" src="${url}" alt="${filename}" loading="lazy">
            </div>
            <div class="photo-info">
                <div class="photo-name">${filename}</div>
                <div class="action-bar">
                    <a href="${url}" download="${filename}" class="download-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                    </a>
                    <a href="#" class="view-btn" data-index="${index}">View</a>
                </div>
            </div>
        `;
        
        // Add to grid
        photoGrid.appendChild(photoCard);
        
        // Add event listener for viewing
        const viewBtn = photoCard.querySelector('.view-btn');
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(url, filename);
        });
        
        // Image onload event
        const img = photoCard.querySelector('.photo-image');
        img.onload = function() {
            loadedCount++;
            if (loadedCount === totalPhotos) {
                loadingElement.style.display = 'none';
            }
        };
        
        img.onerror = function() {
            loadedCount++;
            this.src = 'placeholder.png'; // Show placeholder for failed images
            if (loadedCount === totalPhotos) {
                loadingElement.style.display = 'none';
            }
        };
        
        // Also make the image clickable
        img.addEventListener('click', function() {
            openModal(url, filename);
        });
    });
}

/**
 * Show error message
 */
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    const errorElement = document.getElementById('error');
    errorElement.querySelector('p').textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Extract filename from URL
 */
function getFilenameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        let filename = pathParts[pathParts.length - 1];
        
        // Clean up the filename
        filename = decodeURIComponent(filename);
        
        // If there's a timestamp prefix, remove it
        if (filename.match(/^\d+-/)) {
            filename = filename.replace(/^\d+-/, '');
        }
        
        return filename;
    } catch (e) {
        // If URL parsing fails, just return the last part of the path
        const parts = url.split('/');
        return parts[parts.length - 1] || 'photo';
    }
}

/**
 * Open the full-screen modal to view a photo
 */
function openModal(url, filename) {
    const modal = document.querySelector('.modal');
    const modalImage = modal.querySelector('.modal-image');
    
    modalImage.src = url;
    modalImage.alt = filename;
    
    modal.classList.add('open');
}