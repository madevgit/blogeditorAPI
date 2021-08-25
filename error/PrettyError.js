module.exports = (properties) => {
  let { type, path, value, enumValues, message } = properties;
  switch (type) {
    case "required":
      description = `${path} is required`;
      break;
    case "enum":
      description = `${path} should be ${enumValues.join(" or ")}`;
      break;
    default:
      description = `${path} is invalid`;
      break;
  }
  return {
    name: type,
    description,
  };
};
