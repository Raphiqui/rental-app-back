const mongoose =  require('mongoose');

const rentalSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String,
        url: String,
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pictures: [
        {
            data: Buffer,
            contentType: String
        }
    ],
    facilities: {
        bedNumber: {
            type: Number,
            required: true
        },
        isCarAvailable: {
            type: Boolean,
            required: true
        },
        isPoolAvailable: {
            type: Boolean,
            required: true
        },
        isHotTubAvailable: {
            type: Boolean,
            required: true
        },
        isCookerAvailable: {
            type: Boolean,
            required: true
        },
        nearestTown: {
            timeByCar: { type: String, required: true },
            timeByFoot: { type: String, required: true },
            timeByBicycle: { type: String, required: true }
        },
    }
});

module.exports = mongoose.model('Rental', rentalSchema);
