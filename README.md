# DOCKER SETUP
RUN docker-compose up --build -d

# API Documentation
Refer request.http file.

# API ENDPOINTS
1. Users
    - Register: (POST) /api/user/register 
    - Login: (POST) /api/user/login 
    - Logout: (POST) /api/user/Logout

2. Products
    - Get all Product: (GET) /api/product
    - Get Specific Product: (GET) /api/product
    - Create Product: (POST) /api/product
    - Update Product: (PUT) /api/product
    - Delete Product: (DELETE) /api/product
