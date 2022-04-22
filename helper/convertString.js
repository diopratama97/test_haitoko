exports.stringToArray = (strWords, separator, result = "array") => {
  let arrStings = strWords.split(separator);
  arrStings = arrStings.map((item) => item.trim());

  arrStings = result === "array" ? arrStings : JSON.stringify(arrStings);

  return arrStings;
};
