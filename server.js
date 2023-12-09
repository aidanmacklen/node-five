const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "//public/images" }); 

mongoose
    .connect("")
    .then(()=>{console.log("Connected to mongodb")})
    .catch((error)=>console.log("Couldn't connect to mongodb slime", error));

const jewelSchema = new mongoose.Schema({
    material:String,
    size:String, 
    gem:String,
});

const Jewel = mongoose.model("Jewel", jewelSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/images"); 
});

app.get("/api/jewels", (req, res) => {
    getJewels(res);
});

const getJewels = async (res) => {
    const jewels = await Jewel.find();
    res.send(jewels);
};

app.post("/api/jewels", upload.single("img"), (req, res) => {
    const result = validateJewel(req.body);
    
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const jewel = new Jewel({
        material:req.body.material,
        size:req.body.size,
        gem:req.body.gem
    });

    if (req.file) {
        jewel.img = "images/" + req.file.filename;
    }

    createJewel(jewel, res);
});

const createJewel = async (jewel, res) => {
    const result = await jewel.save();
    res.send(jewel);
}

app.delete("/api/jewels/:id", upload.single("img"), (req, res) => {
    removeJewels(res, req.params.id);
});

const removeJewels = async(res, id) => {
    const jewel = await Jewel.findByIdAndDelete(id);
    res.send(jewel);
}

app.put("/api/jewels/:id", upload.single("img"), (req, res) => {
    const result = validateJewel(req.body);
    
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateJewel(req, res);
});

const updateJewel = async (req, res) => {
    let fieldsToUpdate = {
        material:req.body.material,
        size:req.body.size,
        gem:req.body.gem
    }

    if(req.file) {
        fieldsToUpdate.img - "images/" + req.file.filename;
    }

    const result = await Jewel.updateOne({_id:req.params.id}, fieldsToUpdate);
    const jewel = await Jewel.findById(req.params.id);
    res.send(jewel);
};

const validateJewel = (jewel) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        material: Joi.string().min(3).required(),
        size: Joi.string().min(3).required(),
        gem: Joi.string().min(3).required()
    });

    return schema.validate(jewel);
};

app.listen(3000, () => {
    console.log("On");
});