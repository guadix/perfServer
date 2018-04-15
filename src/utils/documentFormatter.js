const formatter = (doc) => {
  const { UUID, eventId, client, app } = doc;
  const eventList = doc.data || [];
  return eventList.map(event => ({ ...event, UUID, eventId, client, app }));
}

module.exports = formatter;
