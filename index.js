const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const port = 4000;

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."))

const fragmentSchema = new mongoose.Schema({
    fragment: String,
    pseudonym: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Fragment = mongoose.model('Fragment', fragmentSchema);

app.get('/fragments', (req, res) => {
    Fragment.find()
    .then(result => {
        res.json(result);
    })
    .catch(err => console.log(err));
});


app.post('/fragments', (req, res) => {
    const { fragment, pseudonym } = req.body;

    const newFragment = new Fragment({
        fragment: fragment,
        pseudonym: pseudonym
    });

    newFragment.save().then((result, error) => {

        if (error) {
            return res.send(false);
        } else {
            return res.send(true);
        }
    })
    .catch(err => console.log(err));

})

if(require.main === module){
	app.listen(port, () => {
		console.log(`API is now online on port ${port}`);
	})
}

module.exports = {app, mongoose};
