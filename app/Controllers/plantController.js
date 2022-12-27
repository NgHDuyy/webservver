const { client, channel } = require("../../client");
const Time = require("../models/Time");
const Messages = require("../models/Messages");
const Information = require("../models/Information");
const schedule = require("node-schedule");

class plantController {
  controlPump(req, res) {
    client.publish(channel("plant"), "PumpON");
    res.send("ok");
  }

  controlLamp(req, res) {
    client.publish(channel("plant"), "LampON");
    res.send("lampOK");
  }

  getControl(req, res) {
    const messages = new Messages({
      messages: req.body.messages,
    });
    if (messages == "PumpON" || messages == "LampON") {
      client.publish(channel("plant"), messages);
      res.send("ok");
    }
  }

  updateData(req, res) {
    client.publish(channel("plant"), "UPDATE");
  }
  getInfomation(req, res) {
    Information.findOne({}, (err, data) => {
      if (!err) {
        res.json(data);
      } else {
        res.status(400).json({ error: "Error" });
      }
    });
  }
  async updateInfomation(req, res) {
    const id = "1";
    const result = await Information.findOneAndUpdate({ id: id }, { ...req.body }, { new: true });
    res.status(200).json(result);
  }

  getTime(req, res) {
    Time.find({}, null, { sort: { sum: 1 } }, (err, data) => {
      if (!err) {
        res.json(data);
      } else {
        res.status(400).json({ error: "Error" });
      }
    });
  }
  addTime(req, res) {
    const time = new Time({
      stamp: req.body.time,
      sum: Number(req.body.time.replace(":", ".")),
    });

    Time.findOne({ stamp: time.stamp }, (err, stamp) => {
      if (err) {
        console.log(err);
      }
      if (stamp) {
        res.send("dup");
      } else {
        time.save(function (err, data) {
          if (err) console.log(err);
          res.send("success");
        });
      }
    });
  }
  removeTime(req, res) {
    const id = req.body.id;
    Time.findOneAndRemove({ _id: id }, (err, data) => {
      console.log(data);
      if (err) {
        res.send("error");
      }
      res.send("success");
    });
  }
  schedule(req, res) {
    const stamp = req.body.result;
    let times = [];
    console.log(stamp);
    stamp.forEach((element) => {
      times.push({
        hour: element.stamp.split(":")[0],
        minute: element.stamp.split(":")[1],
      });
    });
    times.forEach(function (time) {
      var j = schedule.scheduleJob(time, function () {
        // your job
        client.publish(channel("plant"), "PumpOnAuto");
      });
    });
    res.send("OK");
  }
}

module.exports = new plantController();
