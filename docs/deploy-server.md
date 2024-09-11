### Deploying Flask Backend with Docker (mac)

Prerequisites:

- Docker (installation docs here: https://docs.docker.com/engine/install/)
- Git

1. Clone the repo

   ` git clone https://github.com/yuzhiliu8/bodymaps-website.git`

2. go to flask-server directory

   `cd bodymaps-website/flask-server`

3. run `docker build -t img/bodymaps-server .`

- This will create a docker image called **img/bodymaps-server**
- If the build was successful, you can view this image, **img/bodymaps-server**, using `docker images`
- run `docker run -d -p 5000:5000 --name bodymaps-server img/bodymaps-server`

You should now be able to view the flask application at http://localhost:5000
