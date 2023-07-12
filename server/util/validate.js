const checkForFalsy = (...valArr) => {
  for (let val of valArr) {
    if (val == "" || !val || val == undefined || val == false) return false;
  }

  return true;
};

module.exports = { checkForFalsy };
