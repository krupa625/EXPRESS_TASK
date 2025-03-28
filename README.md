# Express_CRUD_API

# Postman DOC Link

https://documenter.getpostman.com/view/42716488/2sB2cPi4px

# Project_Structure

```

├── public/                            # Static files (HTML, CSS, JS)
│ ├── index.html
│ ├── script.js
│ └── style.css
├── src/                               # Source code
│ ├── app.js                           # Main application file
│ ├── data.json                        # Data storage
│ ├── log.txt                          # Log file
│ ├── config/                          # Configuration files
│ │ └── configuration.js
│ ├── controller/                      # Controllers
│ │ └── item.controller.js
│ ├── middleware/                      # Middleware
│ │ └── fileHandler.js
│ ├── routes/                          # API routes
│ │ ├── index.js
│ │ └── item.routes.js
│ ├── service/                         # Services
│ │ └── logger.js
│ ├── utils/                           # Utility functions
│ │ ├── email.js
│ │ └── responseHelper.js
│ └── validations/                     # Validation logic
│    └── item.validate.js
├── .env                               # Environment variables
├── .gitignore                         # Git ignore file
├── package.json                       # Project metadata and dependencies
└── README.md                          # Documentation

```

# Start

npm run dev
