docker run -d -p 8888:80 \
    -v $(pwd):/usr/share/nginx/html \
    -v $(pwd)/shared_folder:/shared_folder \
    --name d3-simple-cont \
    d3-simple-img

