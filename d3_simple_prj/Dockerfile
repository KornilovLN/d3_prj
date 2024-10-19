# Use the official Python image as the base image
FROM python:3.9-slim

# Install Nginx
RUN apt-get update && apt-get install -y nginx && apt-get clean

# Install Python dependencies
COPY requirements.txt /tmp/
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy your Flask app
COPY app /usr/share/nginx/html/app

# If app.py is at the root, copy it separately
COPY app.py /usr/share/nginx/html/app.py

# Copy a default Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx and your Flask app
CMD ["sh", "-c", "nginx && python /usr/share/nginx/html/app.py"]

