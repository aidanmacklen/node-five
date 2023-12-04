const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" }); 

mongoose
    .connect("mongodb+srv://aidancmacklen:Coolshoes107-@firstcluster.vvj7bt0.mongodb.net/?retryWrites=true&w=majority")
    .then(()=>{console.log("Connected to mongodb")})
    .catch((error)=>console.log("Couldn't connect to mongodb slime", error));

const fruitSchema = new mongoose.Schema({
    name: String,
    color: String,
    taste: String,
    size: String,
    origin: String,
    img: String,
    facts: [String],
});

const Fruit = mongoose.model("Fruit", fruitSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html"); 
});

app.get("/api/fruits", (req, res) => {
    getFruits(res);
});

const getFruits = async (res) => {
    const fruits = await Fruit.find();
    res.send(fruits);
};

app.post("/api/fruits", upload.single("img"), (req, res) => {
    const result = validateFruit(req.body);
    
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const fruit = new Fruit({
        name:req.body.name,
        color:req.body.color,
        taste:req.body.taste,
        size:req.body.size,
        origin:req.body.origin,
        facts:req.body.facts.split(",")
    });

    if (req.file) {
        fruit.img = "images/" + req.file.filename;
    }

    createFruit(fruit, res);
});

const createFruit = async (fruit, res) => {
    const result = await fruit.save();
    res.send(fruit);
}

app.delete("/api/fruits/:id", upload.single("img"), (req, res) => {
    removeFruits(res, req.params.id);
});

const removeFruits = async(res, id) => {
    const fruit = await Fruit.findByIdAndDelete(id);
    res.send(fruit);
}

app.put("/api/fruits/:id", upload.single("img"), (req, res) => {
    const result = validateFruit(req.body);
    
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateFruit(req, res);
});

const updateFruit = async (req, res) => {
    let fieldsToUpdate = {
        name:req.body.name,
        color:req.body.color,
        taste:req.body.taste,
        size:req.body.size,
        origin:req.body.origin,
        facts:req.body.facts.split(",")
    }

    if(req.file) {
        fieldsToUpdate.img - "images/" + req.file.filename;
    }

    const result = await Fruit.updateOne({_id:req.params.id}, fieldsToUpdate);
    const fruit = await Fruit.findById(req.params.id);
    res.send(fruit);
};

const validateFruit = (fruit) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        facts: Joi.allow(""),
        name: Joi.string().min(3).required(),
        color: Joi.string().min(3).required(),
        taste: Joi.string().min(3).required(),
        size: Joi.string().min(3).required(),
        origin: Joi.string().min(3).required()
    });

    return schema.validate(fruit);
};

app.listen(3000, () => {
    console.log("On");
});