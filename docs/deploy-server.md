### Deploying Flask Backend with Docker (mac)

Prerequisites:

- Docker/Docker-compose (installation docs here: https://docs.docker.com/engine/install/)
- Git

1. Clone the repo

   ` git clone https://github.com/yuzhiliu8/bodymaps-website.git`

2. Enter project directory

   `cd bodymaps-website`

3. Create a .env file and edit using nano

   `touch .env`

   `nano .env`

4. Add value for SERVER_BASE_PATH

   ```
   SERVER_BASE_PATH="/bodymaps"
   ```

5. Save and Exit

   `Ctrl + O`, `Enter`, `Ctrl + X`

6. Run

   `docker-compose up -d --build --create-externals server`

You should now be able to view the flask application at `http://localhost:5000/bodymaps/api`

or

`http://{private-ip-of-device}:5000/bodymaps/api`

Using private ip:
![deploy_server(1)](<imgs/deploy_server(1).png>)
