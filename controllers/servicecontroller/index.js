const { SendResponse } = require("../../helper/index");
const PackageModel = require("../../model/packagemodel/index")

const CourseController = {

  add: async (req, res) => {
    try {
      let { name, price, detail } = req.body;
      let obj = { name, price, detail };

      let arr = [
        "name", "price", "detail",];
      let errArr = [];

      arr.forEach((x) => {
        if (!obj[x]) {
          errArr.push(x);
        }
      });
      if (errArr.length > 0) {
        res.status(400).send(SendResponse("Some Fields are Missing", false));
      }
      else {
        let Course = new PackageModel(obj);
        let result = await Course.save();
        res
          .status(200)
          .send(SendResponse(true, "Data Added Successfully", result));

      }
    } catch (e) {
      res.status(500).send(SendResponse(false, "Internal server Error", e));
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const updatedCourse = req.body;
      let result = await PackageModel.findByIdAndUpdate(id, updatedCourse);
      res
        .status(200)
        .send(SendResponse(true, "Data Updated Successfully", result));
    } catch (e) {
      res.status(500).send(SendResponse(false, "Internal server Error", e));
    }
  },

  get: async (req, res) => {
    try {
      let { pageNo, pageSize } = req.query;
      console.log(pageNo, pageSize);
      let skipCount = (pageNo - 1) * pageSize;
      let result = await PackageModel.find().limit(pageSize).skip(skipCount);

      res.status(200).send(SendResponse(true, "", result));
    } catch (e) {
      res.status(500).send(SendResponse(false, "Internal server Error", e));
    }
  },

  getById: async (req, res) => {
    try {
      let id = req.params.id;
      let result = await PackageModel.findById(id);
      res.send(SendResponse(true, "", result));
    } catch (e) {
      res.status(500).send(SendResponse(false, "Internal server Error", e));
    }
  },

  det: (req, res) => {
    try {
      let id = req.params.id;
      PackageModel.findByIdAndDelete(id)
        .then(() => {
          res.status(200).send(SendResponse(true, "Data Deleted Successfully"));
        })
        .catch((err) => {
          res
            .status(400)
            .send(SendResponse(false, "Internal server Error", err));
        });
    } catch (error) {
      res.status(500).send(SendResponse(false, "Internal server Error", error));
    }
  },
  
};

module.exports = CourseController;