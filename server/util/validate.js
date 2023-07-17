const checkForFalsy = (...valArr) => {
  for (let val of valArr) {
    if (val == "" || !val || val == undefined || val == false) return true;
  }

  return false;
};

module.exports = { checkForFalsy };
