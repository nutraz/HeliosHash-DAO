#!/bin/bash
# Docker Development Helper Scripts for HeliosHash DAO

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[DOCKER]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Main function
main() {
    check_docker
    
    case "${1:-dev}" in
        "dev"|"development")
            print_status "Starting HeliosHash DAO in development mode..."
            print_status "Building and starting development container..."
            docker-compose build hhdao-dev
            docker-compose up hhdao-dev
            ;;
        "prod"|"production")
            print_status "Starting HeliosHash DAO in production mode..."
            docker-compose --profile production up hhdao-prod
            ;;
        "dfx")
            print_status "Starting DFX Internet Computer network..."
            docker-compose --profile dfx up dfx-network
            ;;
        "all")
            print_status "Starting all services (dev + prod + dfx)..."
            docker-compose --profile production --profile dfx up
            ;;
        "stop")
            print_status "Stopping all containers..."
            docker-compose down
            print_success "All containers stopped"
            ;;
        "clean")
            print_warning "This will remove all containers and volumes!"
            read -p "Are you sure? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                docker-compose down -v
                docker system prune -f
                print_success "Docker cleanup completed"
            else
                print_status "Cleanup cancelled"
            fi
            ;;
        "logs")
            print_status "Showing logs for development container..."
            docker-compose logs -f hhdao-dev
            ;;
        "shell")
            print_status "Opening shell in development container..."
            docker-compose exec hhdao-dev /bin/sh
            ;;
        "build")
            print_status "Building all Docker images..."
            docker-compose build
            print_success "Build completed"
            ;;
        "status")
            print_status "Docker container status:"
            docker-compose ps
            ;;
        "help"|"-h"|"--help")
            echo "HeliosHash DAO Docker Helper"
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  dev        Start development environment (default)"
            echo "  prod       Start production environment"
            echo "  dfx        Start DFX Internet Computer network"
            echo "  all        Start all services"
            echo "  stop       Stop all containers"
            echo "  clean      Remove containers and cleanup"
            echo "  logs       Show development container logs"
            echo "  shell      Open shell in development container"
            echo "  build      Build all Docker images"
            echo "  status     Show container status"
            echo "  help       Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0 dev     # Start development server on http://localhost:3000"
            echo "  $0 prod    # Start production server on http://localhost:3001"
            echo "  $0 logs    # View real-time logs"
            echo "  $0 clean   # Clean up everything"
            ;;
        *)
            print_error "Unknown command: $1"
            print_status "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"