const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/rallyCars', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Could not connect to MongoDB", err));

const rallyCarSchema = new mongoose.Schema({
    name: String,
    horsepower: String,
    weight: String,
    config: String,
    color: String,
    team: [String]
});

const rallyCar = mongoose.model('rallyCar', rallyCarSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/rallyCars', (req, res) => {
    getRallyCars(res);
});

async function getRallyCars(res) {
    const rallyCars = await rallyCar.find();
    console.log(rallyCars);
    res.send(rallyCars)
}

app.get('/api/rallyCars/:id', (req, res) => {
    // const rallycar = rallyCars.find(r => r.id === parseInt(req.params.id));
    // if(!rallycar) res.status(404).send("Rally Car with given id was not found");
    // res.send(rallycar);

    getRallyCar(req.params.id, res);

});

async function getRallyCar(id, res) {
    const rallycar = await rallyCar.findOne({ _id: id });
    console.log(rallycar)
    res.send(rallycar);
}

app.post('/api/rallyCars', (req, res) => {
    const result = validateRallyCar(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const rallycar = rallyCar({
        name: req.body.name,
        horsepower: req.body.horsepower,
        weight: req.body.weight,
        config: req.body.config,
        color: req.body.color,
        team: req.body.team
    });

    createRallyCar(rallycar, res);
});

async function createRallyCar(rallycar, res) {
    const result = await rallycar.save();
    console.log(result);
    res.send(rallycar);
}

app.put('/api/rallyCars/:id', (req, res) => {
    const result = validateRallyCar(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateRallyCar(res, req.params.id, req.body.name, req.body.horsepower, req.body.weight, req.body.config, req.body.color, req.body.team);
});

async function updateRallyCar(res, id, name, horsepower, weight, config, color, team) {
    const result = await rallyCar.updateOne({ _id: id }, {
        $set: {
            name: name,
            horsepower: horsepower,
            weight: weight,
            config: config,
            color: color,
            team: team
        }
    })

    res.send(result);
}

app.delete('/api/rallyCars/:id', (req, res) => {
    removeRallyCar(res, req.params.id);
});

async function removeRallyCar(res, id) {
    const rallycar = await rallyCar.findByIdAndRemove(id);
    res.send(rallycar);
}

function validateRallyCar(rallyCars) {
    const schema = {
        name: Joi.string().min(3).required(),
        horsepower: Joi.string().min(3).required(),
        weight: Joi.string().min(3).required(),
        config: Joi.string().min(3).required(),
        color: Joi.string().min(3).required(),
        team: Joi.string().min(3).required()
    };

    return Joi.validate(rallyCars, schema);
}

app.listen(3000, () => {
    console.log("listening on port 3000")
});