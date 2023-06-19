const { User } = require("./../model/db");

module.exports.getUsers = async (req, res) => {
  await User.find({})
    .then((e) => {
      res.json(e);
    })
    .catch((err) => {
      res.status(400).json({ msg: err.json });
    });
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findOneAndDelete({ _id: id })
    .then((e) => {
      if (!e) {
        return res.status(404).json({ msg: "cannot delete who doesn't exist" });
      }
      res.status(204).json({ msg: "deleted successfully" });
    })
    .catch((err) => {
      res.status(400).json({ msg: err.json });
    });
};

module.exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  await User.findOne({ _id: id })
    .then((e) => {
      if (!e) {
        return res.status(404).json({ msg: "user not found" });
      } else {
        return res.status(202).json(e);
      }
    })
    .catch((err) => {
      res.status(400).json({ msg: err.json });
    });
};
