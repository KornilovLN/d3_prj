#!/bin/bash

echo "Select an option:"
echo "1 - Create image if it doesn't exist"
echo "2 - Rebuild image (stop and remove container first)"
echo "3 - Restart container"

read -p "Enter your choice: " choice
echo "You selected option: $choice"
