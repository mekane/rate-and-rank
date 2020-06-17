# Node Server for Rate and Rank

This is a Node server whose main job is to render a DataGrid and keep one in memory with
its history and state. It will listen for actions and update the view according to the new state.

## Running Locally

   * `npm install`
   * `npm start`

## Running Docker Container

   * Run `npm run build` in the parent directory to make sure the server lib/ bundle is up to date.
   * `docker build -t rate-and-rank`
   * `docker run -p 8666:8666 -d rate-and-rank` (maps host port:container port)

   Other helpful docker commands:

   * `docker images` to list available images
   * `docker ps` to list running containers
   * `docker logs <container id>` to print app output
   * `docker exec -it <container id> /bin/bash` enter an interactive shell inside the container

   From [Dockerizing a Node web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

   See also: [How to use Node Docker Image](https://github.com/nodejs/docker-node/blob/master/README.md#how-to-use-this-image)
