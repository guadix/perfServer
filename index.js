// @TODO move to config
//process.env.ELASTIC_URL = 'http://10.54.0.208:9200';
process.env.ELASTIC_URL = 'http://localhost:9200';

const express = require('express');
const bodyParser = require('body-parser');
const userAgent = require('useragent');
const elastic = require('./src/clients/elastic');
const documentFormatter = require('./src/utils/documentFormatter');

const app = express();
app.use(bodyParser.text());

app.post('/collector', function (req, res, next) {
  console.log('=================================================================');
  console.log('=================================================================');
  console.log('  ||||    |||| ||||||| ||||||||| ||||||||| || |||||||| ||||||||  ');
  console.log('  ||  ||||  || ||          ||    ||     || || ||       ||        ');
  console.log('  ||   ||   || ||||        ||    ||||||||  || ||       ||||||||  ');
  console.log('  ||        || ||          ||    ||    ||  || ||             ||  ');
  console.log('  ||        || |||||||     ||    ||     || || |||||||| ||||||||  ');
  console.log('=================================================================');
  console.log('=================================================================');

  //console.log(JSON.parse(req.body));

  const promises = documentFormatter(JSON.parse(req.body)).map((doc) => {

    if (doc.entryType === 'measure') {
      doc.totalTimeToMainContent = doc.duration + doc.startTime;
    }

    agent = userAgent.parse(req.headers['user-agent']);
    doc.client.browser = agent.family;
    doc.client.os = agent.os.toJSON().family;

    doc.date_ts = Date.now();
    console.log(doc);

    elastic.addDocument(doc, 'collector', doc.entryType)
  })

  Promise.all(promises)
    .then(() => res.status(200).send({ message: 'OK' }))
    .catch(err => res.status(500).send(err));
})

app.get('/test', function (req, res) {
  const testDoc = {
    type: 'test',
    foo: 'bar'
  }
  elastic.addDocument(testDoc, 'test')
    .then(() => res.status(200).send('OK'))
    .catch(err => res.status(500).send(err));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
