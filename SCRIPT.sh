# COMPILAR TYPESCRIPT
cd ./unqfy && tsc && cd ..
cd ./notifications && tsc && cd ..
cd ./logging && tsc && cd ..
cd ./monitor && tsc && cd ..

# GENERAR IMAGENES DE DOCKER
docker build -t unqfy_image ./unqfy
docker build -t unqfy_notifications_image ./notifications
docker build -t unqfy_logging_image ./logging
docker build -t unqfy_monitor_image ./monitor

# CREAR RED
docker network create --subnet=172.20.0.0/16 unqfynet

# LEVANTAR CONTENEDORES
docker run --net unqfynet --ip 172.20.0.21 -d -p 5000:5000 --name "unqfy" unqfy
docker run --net unqfynet --ip 172.20.0.22 -d -p 5001:5001 --name "unqfy_notifications" unqfy_notifications
docker run --net unqfynet --ip 172.20.0.23 -d -p 5002:5002 --name "unqfy_logging" unqfy_logging_image
docker run --net unqfynet --ip 172.20.0.24 -d -p 5011:5011 --name "unqfy_monitor" unqfy_monitor_image

# FRENAR CONTENEDORES
docker stop "unqfy"
docker stop "unqfy_notifications"
docker stop "unqfy_logging"
docker stop "unqfy_monitor"
