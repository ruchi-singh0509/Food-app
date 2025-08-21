@echo off
setlocal enabledelayedexpansion

:: Food App Environment Setup Script for Windows
:: This script helps set up the environment for development or production

:: Colors for output
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "NC=[0m"

:: Function to print colored messages
:print_message
echo %~2%~1%NC%
goto :eof

:: Check for required tools
:check_requirements
call :print_message "Checking requirements..." %YELLOW%

where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    call :print_message "Error: Docker is not installed. Please install Docker first." %RED%
    call :print_message "Visit https://docs.docker.com/get-docker/ for installation instructions." %YELLOW%
    exit /b 1
)

where docker-compose >nul 2>&1
if %ERRORLEVEL% neq 0 (
    call :print_message "Error: Docker Compose is not installed. Please install Docker Compose first." %RED%
    call :print_message "Visit https://docs.docker.com/compose/install/ for installation instructions." %YELLOW%
    exit /b 1
)

call :print_message "All requirements satisfied!" %GREEN%
goto :eof

:: Setup environment files
:setup_env_files
call :print_message "Setting up environment files..." %YELLOW%

:: Backend .env
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        call :print_message "Created backend/.env from example file" %GREEN%
    ) else (
        call :print_message "Warning: backend/.env.example not found. Please create backend/.env manually." %YELLOW%
    )
) else (
    call :print_message "backend/.env already exists" %GREEN%
)

:: Frontend .env
if not exist "frontend\.env" (
    if exist "frontend\.env.example" (
        copy "frontend\.env.example" "frontend\.env" >nul
        call :print_message "Created frontend/.env from example file" %GREEN%
    ) else (
        call :print_message "Warning: frontend/.env.example not found. Please create frontend/.env manually." %YELLOW%
    )
) else (
    call :print_message "frontend/.env already exists" %GREEN%
)

:: Admin .env
if not exist "admin\.env" (
    if exist "admin\.env.example" (
        copy "admin\.env.example" "admin\.env" >nul
        call :print_message "Created admin/.env from example file" %GREEN%
    ) else (
        call :print_message "Warning: admin/.env.example not found. Please create admin/.env manually." %YELLOW%
    )
) else (
    call :print_message "admin/.env already exists" %GREEN%
)

:: Root .env for production
if "%~1"=="production" (
    if not exist ".env" (
        echo MONGODB_URL=mongodb://mongo:27017/food-app> .env
        echo JWT_SECRET=change_this_to_a_secure_random_string>> .env
        echo SESSION_SECRET=change_this_to_another_secure_random_string>> .env
        echo STRIPE_KEY=your_stripe_key_here>> .env
        echo CORS_ORIGIN=https://example.com,https://www.example.com>> .env
        echo API_URL=https://example.com/api>> .env
        call :print_message "Created root .env file for production" %GREEN%
        call :print_message "IMPORTANT: Edit the .env file with your production values!" %YELLOW%
    )
)
goto :eof

:: Create nginx directory if needed
:setup_nginx
if "%~1"=="production" (
    call :print_message "Setting up Nginx for production..." %YELLOW%
    
    :: Create nginx/ssl directory if it doesn't exist
    if not exist "nginx\ssl" (
        mkdir "nginx\ssl" 2>nul
        call :print_message "Created nginx/ssl directory" %GREEN%
        call :print_message "IMPORTANT: Place your SSL certificates (fullchain.pem and privkey.pem) in the nginx/ssl directory" %YELLOW%
    )
    
    :: Remind to update domain in nginx.conf
    if exist "nginx\nginx.conf" (
        call :print_message "IMPORTANT: Update the domain name in nginx/nginx.conf to match your actual domain" %YELLOW%
    )
)
goto :eof

:: Start the application
:start_app
if "%~1"=="production" (
    call :print_message "Starting the application in production mode..." %YELLOW%
    docker-compose -f docker-compose.prod.yml up -d
    call :print_message "Application started in production mode!" %GREEN%
    call :print_message "Frontend: https://your-domain.com" %GREEN%
    call :print_message "Admin Panel: https://your-domain.com/admin" %GREEN%
    call :print_message "API: https://your-domain.com/api" %GREEN%
) else (
    call :print_message "Starting the application in development mode..." %YELLOW%
    docker-compose up -d
    call :print_message "Application started in development mode!" %GREEN%
    call :print_message "Backend API: http://localhost:4000" %GREEN%
    call :print_message "Frontend: http://localhost:5173" %GREEN%
    call :print_message "Admin Panel: http://localhost:5174" %GREEN%
    call :print_message "MongoDB: localhost:27017" %GREEN%
)
goto :eof

:: Main function
:main
:: Check if environment argument is provided
if "%~1"=="" (
    call :print_message "Usage: %0 [development^|production]" %YELLOW%
    call :print_message "Example: %0 development" %YELLOW%
    exit /b 1
)

if not "%~1"=="development" if not "%~1"=="production" (
    call :print_message "Invalid environment. Use 'development' or 'production'." %RED%
    exit /b 1
)

call :print_message "Setting up Food App for %~1 environment" %GREEN%

:: Run the setup steps
call :check_requirements
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

call :setup_env_files "%~1"
call :setup_nginx "%~1"

:: Ask if user wants to start the application
set /p "REPLY=Do you want to start the application now? (y/n): "
if /i "%REPLY%"=="y" (
    call :start_app "%~1"
) else (
    if "%~1"=="production" (
        call :print_message "To start the application later, run: docker-compose -f docker-compose.prod.yml up -d" %YELLOW%
    ) else (
        call :print_message "To start the application later, run: docker-compose up -d" %YELLOW%
    )
)

call :print_message "Setup complete!" %GREEN%
goto :eof

:: Run the main function with the provided argument
call :main %1