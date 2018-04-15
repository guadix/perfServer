const axios = require('axios');
const elasticUrl = process.env.ELASTIC_URL

const addDocument = (doc, index, type) =>
  axios.post(`${elasticUrl}/${index}/${type || doc.type}/${doc.id || ''}`, doc)

module.exports = { addDocument };
