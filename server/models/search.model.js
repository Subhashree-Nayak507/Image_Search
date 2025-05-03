
const searchSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        index: true 
    },
    query: {
         type: String, 
         required: true, 
         index: true 
    },
    imageIds: 
        [String]
    , 
    expiresAt: { type: Date, expires: '3d' }
  });

const Search = mongoose.model("Search", searchSchema);

export default Search;