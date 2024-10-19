#!/bin/bash

# Function to check if the image exists
image_exists() {
    docker images | grep -q "d3-simple-img"
}

# Function to stop and remove the container
remove_container() {
    echo "Stopping and removing the container..."
    docker-compose down
}

# Function to build the image
build_image() {
    echo "Building the Docker image..."
    docker-compose build
}

# Function to start the container
start_container() {
    echo "Starting the container..."
    docker-compose up -d
}

# Display menu options
echo "Select an option:"
echo "1 - Create image if it doesn't exist"
echo "2 - Rebuild image (stop and remove container first)"
echo "3 - Restart container"

# Read user input
read -p "Enter your choice: " choice
echo "You selected option: $choice"

case $choice in
    1)
        if image_exists; then
            echo "Image already exists. No action taken."
        else
            echo "Image does not exist. Building image..."
            build_image
            start_container
        fi
        ;;
    2)
        echo "Rebuilding image..."
        remove_container
        build_image
        start_container
        ;;
    3)
        echo "Restarting container..."
        remove_container
        start_container
        ;;
    *)
        echo "Invalid option. Please select 1, 2, or 3."
        ;;
esac
