module.exports = (error, request, response, _) => {
  console.log(error);
  response.sendStatus(500);
};
