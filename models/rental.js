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
        contentType: String
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
});

module.exports = mongoose.model('Rental', rentalSchema);
