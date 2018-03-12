module.exports = (record, newAttributes) => {
  Object.keys(newAttributes).forEach((attribute) => {
    if (
      record.hasOwnProperty(attribute) &&
      typeof record[attribute] !== 'object' &&
      typeof newAttributes[attribute] !== 'object'
    ) {
      record[attribute] = newAttributes[attribute]
    }
  });
};
