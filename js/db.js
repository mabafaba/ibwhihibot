// CONNECT TO DATABASE
import mongoose from 'mongoose';

// get url depending on environment
const isDocker = process.env.DOCKER === 'true';
const url = isDocker ? 'mongodb://inberlinwohnenbot-mongodb:27017/flatbot' : 'mongodb://localhost:27017/flatbot';

main().catch((err) => {console.log('MONGODB ERROR!', err)});

async function main() {
  await mongoose.connect(url);
}

mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');

    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);
    });
})


// SCHEMAS FOR FLATS AND CHATS

const Schema = mongoose.Schema;

const flatSchema = new Schema({
    title: String,
    details: String,
    link: String,
    createdAt: { type: Date, default: Date.now }
});

const Flat = mongoose.model('Flat', flatSchema);

const chatSchema = new Schema({
    chat_id: Number,
});

const Chat = mongoose.model('Chat', chatSchema);



// FUNCTIONS TO INTERACT WITH DATABASE

function saveFlat (flat) {

    // check if flat with same link already exists
    Flat.find({ link: flat.link }).then((docs) => {
        if (docs.length === 0) {
            // save flat to database
            const newFlat = new Flat(flat);
            newFlat.save()
                .then((data) => {
                    console.log('Flat saved to database', data);
                })
                .catch((err) => {
                    console.log('Error saving flat to database', err);
                });
        }
    });
}

function saveChat (chat_id) {
    // check if chat_id already exists
    Chat.find({ chat_id: chat_id }).then((docs) => {
        if (docs.length === 0) {
            // save chat_id to database
            const newChat = new Chat({ chat_id: chat_id });
            newChat.save()
                .then((data) => {
                    console.log('Chat saved to database', data);
                })
                .catch((err) => {
                    console.log('Error saving chat to database', err);
                });
        }
    });
}

function storedChatIDs () {
    return Chat.find({}).then((docs) => {
        return docs.map((doc) => doc.chat_id);
    });
}


function storedFlats () {
    return Flat.find({}).then((docs) => {
        return docs;
    });
}

function isFlatNew (flat) {
    
    return Flat.find({ link: flat.link }).then((docs) => {
        return docs.length === 0;
    });
}

function latestFlat () {
    return Flat.find({}).sort({ createdAt: -1 }).limit(1).then((docs) => {
        return docs[0];
    });
}

const botdb = { saveFlat, saveChat, storedChatIDs, storedFlats, isFlatNew, latestFlat };

// export db as default
export default botdb;