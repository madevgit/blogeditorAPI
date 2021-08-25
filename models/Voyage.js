const mongoose = require('mongoose')
const VoyageSchema = new mongoose.Schema({
    bus: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Bus' },
    date: { type: Date, required: true },
    pointsTrajet: [{
        gare: { type: mongoose.SchemaTypes.ObjectId, ref: 'Gare', required: true },
        HeureDepart: { type: Date, required },
        Prix: { type: Number, required: true }
    }]
})
module.exports = mongoose.model('Voyage', VoyageSchema)