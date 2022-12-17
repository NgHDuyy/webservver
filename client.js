const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://ngoinhaiot.com:1111", {
  username: "cnpmn12",
  password: "900CB621F2AD4B0D",
});
exports.client = client;
exports.channel = (topic) => `cnpmn12/${topic}`;
