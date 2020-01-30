# tikitaka
Backend

1. Download prometheus from https://prometheus.io/download/
2. In your terminal, run prometheus.
$ cd Downloads
$ cd prometheus-2.15.2.darwin-amd64
$ ./prometheus
3. Substitute app.js with your own app that you want to test.
4. In your terminal of the Tikitaka project, install all dependencies:
$ npm install
5. Run the docker image of Zipkin:
$ docker run --rm -d -p 9411:9411 --name zipkin openzipkin/zipkin
6. Run the our tracing.js along with your app:
$ node -r ./tracing.js app.js
