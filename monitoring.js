"use strict";

const { MeterRegistry } = require('@opentelemetry/metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const axios = require("axios");

const meter = new MeterRegistry().getMeter('your-meter-name');

meter.addExporter(
  new PrometheusExporter(
    { startServer: true },
    () => {
      console.log("prometheus scrape endpoint: http://localhost:9464/metrics");
    }
  )
);

const requestCount = meter.createCounter("requests", {
  monotonic: true,
  labelKeys: ["route"],
  description: "Count all incoming requests"
});

const boundInstruments = new Map();

module.exports.countAllRequests = () => {
  return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
      const labelSet = meter.labels({ route: req.path });
      const boundCounter = requestCount.bind(labelSet);
      boundInstruments.set(req.path, boundCounter);
    }
    boundInstruments.get(req.path).add(1);

    axios
    .get(`http://localhost:9411/zipkin/api/v2/traces`)
    .then(() => axios.get(`http://localhost:9411/zipkin/api/v2/traces`))
    .then(result => {
      // console.log(result.data[0]); // this is the JSON data of traces
    })
    .catch(err => {
      console.error(err);
    });
    return next();
  };
};
