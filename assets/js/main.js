/**
 * Main JavaScript for Italian Holidays Shop
 * Handles dynamic content loading and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initializeNavigation();
  initializeCountdownTimer();
  initializeProductFilters();
  initializeSearch();
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
  // Toggle search form
  const searchToggle = document.querySelector('.search-toggle');
  const searchContainer = document.querySelector('.search-container');
  
  if (searchToggle && searchContainer) {
    searchToggle.addEventListener('click', function() {
      searchContainer.classList.toggle('active');
      if (searchContainer.classList.contains('active')) {
        searchContainer.querySelector('input').focus();
      }
    });
  }
  
  // Mobile navigation toggle
  const mobileToggle = document.createElement('button');
  mobileToggle.className = 'mobile-nav-toggle';
  mobileToggle.setAttribute('aria-label', 'Toggle navigation');
  mobileToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  
  const navMenu = document.querySelector('.site-navigation');
  if (navMenu) {
    navMenu.parentNode.insertBefore(mobileToggle, navMenu);
    
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
}

/**
 * Countdown timer functionality
 */
function initializeCountdownTimer() {
  const countdownContainer = document.getElementById('holiday-countdown');
  if (!countdownContainer) return;
  
  // Fetch holidays data
  fetch('/jekyll-italian-holidays-shop/assets/js/holidays.json')
    .then(response => response.json())
    .catch(() => {
      // If fetch fails, try to get data from window object (populated by Jekyll)
      return window.holidaysData || [];
    })
    .then(holidays => {
      if (!holidays || !holidays.length) {
        console.error('No holidays data available');
        return;
      }
      
      // Find the next upcoming holiday
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let nextHoliday = null;
      
      for (const holiday of holidays) {
        const holidayDate = new Date(holiday.date);
        if (holidayDate >= today) {
          nextHoliday = holiday;
          break;
        }
      }
      
      // If no upcoming holiday found, use the first one for next year
      if (!nextHoliday && holidays.length > 0) {
        nextHoliday = holidays[0];
        // Adjust date to next year
        const nextYear = today.getFullYear() + 1;
        nextHoliday = {
          ...nextHoliday,
          date: nextHoliday.date.replace(/^\d{4}/, nextYear)
        };
      }
      
      if (nextHoliday) {
        updateCountdownDisplay(nextHoliday);
        startCountdown(nextHoliday);
      }
    });
}

/**
 * Update the countdown display with holiday information
 */
function updateCountdownDisplay(holiday) {
  const nameElement = document.getElementById('next-holiday-name');
  const dateElement = document.getElementById('next-holiday-date');
  const linkElement = document.getElementById('holiday-link');
  
  if (nameElement) {
    nameElement.textContent = holiday.name;
  }
  
  if (dateElement) {
    const holidayDate = new Date(holiday.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = holidayDate.toLocaleDateString('en-US', options);
  }
  
  if (linkElement) {
    linkElement.href = `/jekyll-italian-holidays-shop/holidays/${holiday.slug}/`;
  }
}

/**
 * Start the countdown timer
 */
function startCountdown(holiday) {
  const daysElement = document.getElementById('countdown-days');
  const hoursElement = document.getElementById('countdown-hours');
  const minutesElement = document.getElementById('countdown-minutes');
  const secondsElement = document.getElementById('countdown-seconds');
  
  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
  
  const holidayDate = new Date(holiday.date);
  
  function updateCountdown() {
    const now = new Date();
    const difference = holidayDate - now;
    
    if (difference <= 0) {
      // Holiday has arrived
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Update display with leading zeros
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Update immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Product filtering functionality
 */
function initializeProductFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      const productItems = document.querySelectorAll('.product-item');
      
      productItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Search functionality
 */
function initializeSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const resultsGrid = document.getElementById('results-grid');
  const searchCount = document.getElementById('search-count');
  const noResults = document.getElementById('no-results');
  const loading = document.getElementById('loading');
  
  if (!searchForm || !searchInput) return;
  
  // Get filter elements if they exist
  const holidayFilter = document.getElementById('holiday-filter');
  const dateFilter = document.getElementById('date-filter');
  const priceFilter = document.getElementById('price-filter');
  const resetFilters = document.getElementById('reset-filters');
  
  // Handle search form submission
  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    performSearch();
  });
  
  // Handle filter changes
  if (holidayFilter) holidayFilter.addEventListener('change', performSearch);
  if (dateFilter) dateFilter.addEventListener('change', performSearch);
  if (priceFilter) priceFilter.addEventListener('change', performSearch);
  
  // Reset filters
  if (resetFilters) {
    resetFilters.addEventListener('click', function() {
      if (holidayFilter) holidayFilter.value = '';
      if (dateFilter) dateFilter.value = '';
      if (priceFilter) priceFilter.value = '';
      performSearch();
    });
  }
  
  // Check for URL parameters on page load
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q');
  if (queryParam && searchInput) {
    searchInput.value = queryParam;
    performSearch();
  }
  
  function performSearch() {
    if (!resultsGrid || !searchCount || !noResults || !loading) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    // Show loading state
    loading.style.display = 'block';
    resultsGrid.style.display = 'none';
    noResults.style.display = 'none';
    
    // Fetch products data
    fetch('/jekyll-italian-holidays-shop/assets/js/products.json')
      .then(response => response.json())
      .catch(() => {
        // If fetch fails, try to get data from window object (populated by Jekyll)
        return window.productsData || [];
      })
      .then(products => {
        if (!products || !products.length) {
          console.error('No products data available');
          loading.style.display = 'none';
          noResults.style.display = 'block';
          return;
        }
        
        // Apply filters
        let filteredProducts = products;
        
        // Text search
        if (query) {
          filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
          );
        }
        
        // Holiday filter
        if (holidayFilter && holidayFilter.value) {
          filteredProducts = filteredProducts.filter(product => 
            product.holiday === holidayFilter.value
          );
        }
        
        // Date filter
        if (dateFilter && dateFilter.value) {
          const today = new Date();
          
          switch (dateFilter.value) {
            case 'current':
              // Find current holiday
              const currentHoliday = window.holidaysData?.find(h => {
                const holidayDate = new Date(h.date);
                const nextDay = new Date(holidayDate);
                nextDay.setDate(nextDay.getDate() + 1);
                return today >= holidayDate && today < nextDay;
              });
              
              if (currentHoliday) {
                filteredProducts = filteredProducts.filter(product => 
                  product.holiday === currentHoliday.id
                );
              } else {
                filteredProducts = [];
              }
              break;
              
            case 'upcoming':
              // Find upcoming holidays
              const upcomingHolidays = window.holidaysData?.filter(h => {
                const holidayDate = new Date(h.date);
                return holidayDate > today;
              }) || [];
              
              const upcomingHolidayIds = upcomingHolidays.map(h => h.id);
              filteredProducts = filteredProducts.filter(product => 
                upcomingHolidayIds.includes(product.holiday)
              );
              break;
              
            case 'past':
              // Find past holidays
              const pastHolidays = window.holidaysData?.filter(h => {
                const holidayDate = new Date(h.date);
                return holidayDate < today;
              }) || [];
              
              const pastHolidayIds = pastHolidays.map(h => h.id);
              filteredProducts = filteredProducts.filter(product => 
                pastHolidayIds.includes(product.holiday)
              );
              break;
          }
        }
        
        // Price filter
        if (priceFilter && priceFilter.value) {
          const [min, max] = priceFilter.value.split('-').map(v => parseFloat(v));
          
          filteredProducts = filteredProducts.filter(product => {
            const price = product.sale_price || product.price;
            
            if (max) {
              return price >= min && price <= max;
            } else {
              return price >= min;
            }
          });
        }
        
        // Display results
        displaySearchResults(filteredProducts);
      });
  }
  
  function displaySearchResults(products) {
    if (!resultsGrid || !searchCount || !noResults || !loading) return;
    
    // Hide loading state
    loading.style.display = 'none';
    
    // Update results count
    searchCount.textContent = `${products.length} products found`;
    
    if (products.length === 0) {
      // Show no results message
      resultsGrid.style.display = 'none';
      noResults.style.display = 'block';
      return;
    }
    
    // Show results grid
    resultsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Clear previous results
    resultsGrid.innerHTML = '';
    
    // Add product cards
    products.forEach(product => {
      const productCard = createProductCard(product);
      resultsGrid.appendChild(productCard);
    });
  }
  
  function createProductCard(product) {
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.setAttribute('data-category', product.category);
    
    // Create product card HTML
    productItem.innerHTML = `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <a href="/jekyll-italian-holidays-shop/products/${product.id}/" class="product-link">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.sale_price ? '<span class="product-badge sale">Sale</span>' : ''}
            ${product.is_new ? '<span class="product-badge new">New</span>' : ''}
          </a>
        </div>
        
        <div class="product-info">
          <h3 class="product-title">
            <a href="/jekyll-italian-holidays-shop/products/${product.id}/">${product.name}</a>
          </h3>
          
          <div class="product-meta">
            <span class="product-holiday">${product.holiday}</span>
            <span class="product-date">${new Date(product.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          
          <div class="product-price">
            ${product.sale_price 
              ? `<span class="price-original">€${product.price}</span>
                 <span class="price-sale">€${product.sale_price}</span>`
              : `<span class="price-regular">€${product.price}</span>`
            }
          </div>
          
          <div class="product-actions">
            <a href="${product.affiliate_link}" class="btn btn-primary buy-now" target="_blank" rel="noopener">
              Buy Now
            </a>
            <button class="btn btn-secondary add-to-wishlist" data-product-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
    
    return productItem;
  }
}

/**
 * Affiliate link redirection system
 * Tracks clicks and redirects to affiliate links
 */
document.addEventListener('click', function(event) {
  // Check if clicked element is a buy now button
  const buyButton = event.target.closest('.buy-now');
  if (!buyButton) return;
  
  // Get the affiliate link
  const affiliateLink = buyButton.getAttribute('href');
  if (!affiliateLink || affiliateLink === '#') return;
  
  // Prevent default action
  event.preventDefault();
  
  // Get product information
  const productCard = buyButton.closest('.product-card');
  const productId = productCard ? productCard.getAttribute('data-product-id') : 'unknown';
  
  // Track the click (in a real implementation, this would send data to an analytics service)
  console.log(`Affiliate link clicked: ${productId} -> ${affiliateLink}`);
  
  // Redirect to the affiliate link after a short delay
  setTimeout(() => {
    window.open(affiliateLink, '_blank');
  }, 100);
});

/**
 * Wishlist functionality
 */
document.addEventListener('click', function(event) {
  // Check if clicked element is an add to wishlist button
  const wishlistButton = event.target.closest('.add-to-wishlist');
  if (!wishlistButton) return;
  
  // Prevent default action
  event.preventDefault();
  
  // Get product ID
  const productId = wishlistButton.getAttribute('data-product-id');
  if (!productId) return;
  
  // Get current wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  
  // Check if product is already in wishlist
  const index = wishlist.indexOf(productId);
  
  if (index === -1) {
    // Add to wishlist
    wishlist.push(productId);
    wishlistButton.classList.add('active');
    
    // Show notification
    showNotification('Product added to wishlist');
  } else {
    // Remove from wishlist
    wishlist.splice(index, 1);
    wishlistButton.classList.remove('active');
    
    // Show notification
    showNotification('Product removed from wishlist');
  }
  
  // Save updated wishlist
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
});

/**
 * Show a notification message
 */
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
  }
  
  // Set message and show notification
  notification.textContent = message;
  notification.classList.add('show');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}