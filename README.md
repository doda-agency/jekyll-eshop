# Italian Holidays Shop - Jekyll E-commerce Site

A Jekyll-based e-commerce website featuring products for Italian holidays and celebrations. This site is designed to be hosted on GitHub Pages.

## Project Overview

This e-commerce platform specializes in products related to Italian holidays and celebrations. The site features:

- A countdown timer to the next Italian holiday
- Holiday-specific product collections
- Search functionality for all products
- Affiliate link redirection system
- Responsive design for all devices

## Project Structure

```
jekyll-italian-holidays-shop/
├── _data/                      # Data files
│   ├── products.json           # Product database with dates and affiliate links
│   └── holidays.json           # Italian holidays data
├── _includes/                  # Reusable components
│   ├── header.html             # Site header
│   ├── footer.html             # Site footer
│   ├── countdown.html          # Holiday countdown timer
│   └── product-card.html       # Product display template
├── _layouts/                   # Page templates
│   ├── default.html            # Main site layout
│   ├── holiday.html            # Holiday-specific layout
│   └── product.html            # Individual product layout
├── assets/                     # Static assets
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript files
│   └── images/                 # Site images
├── _pages/                     # Content pages
│   ├── holidays/               # Holiday-specific pages
│   └── search.html             # Search page
├── _config.yml                 # Jekyll configuration
├── index.html                  # Homepage with countdown
├── Gemfile                     # Ruby dependencies
└── README.md                   # Project documentation
```

## Setup and Installation

### Prerequisites

- Ruby version 2.5.0 or higher
- RubyGems
- GCC and Make

### Local Development

1. Clone this repository
   ```
   git clone https://github.com/username/jekyll-italian-holidays-shop.git
   cd jekyll-italian-holidays-shop
   ```

2. Install dependencies
   ```
   bundle install
   ```

3. Run the development server
   ```
   bundle exec jekyll serve
   ```

4. View the site at `http://localhost:4000/jekyll-italian-holidays-shop/`

## Deployment

This site is configured for GitHub Pages deployment. Simply push changes to the main branch of your GitHub repository, and GitHub Pages will automatically build and deploy the site.

## Adding Content

### Adding Products

Add new products by creating entries in the `_data/products.json` file following the established format.

### Adding Holidays

Add new holidays by creating entries in the `_data/holidays.json` file and corresponding pages in the `_pages/holidays/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.