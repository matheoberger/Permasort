const {
  getAssociations,
  modifyAssociation,
  appendObject,
} = require("./getAssociations");

async function createAssociation(vegetable, associations) {
  var data = await getAssociations();
  var newAssociation = [];
  var action;
  //   if (!associations) {
  //     action = 3;
  //   } else {
  data.associations.forEach((element, i) => {
    if (element.vegetable == vegetable) {
      associations.forEach((associationInput) => {
        if (element.vegetableAssociations.includes(associationInput)) {
          console.log(
            `${vegetable} has been already associate with ${associationInput}`
          );
        } else {
          console.log("pushed " + associationInput);
          data.associations[i].vegetableAssociations.push(associationInput);
          action = 1;
        }
      });
    } else {
      if (!action) {
        action = 2;
      }
    }
  });
  //   }

  switch (action) {
    case 1:
      modifyAssociation(data);
      break;
    case 2:
      console.log("new associations ! ");
      var tempObject = {
        vegetable: vegetable,
        vegetableAssociations: associations,
      };
      await appendObject(tempObject);
      break;
    default:
      break;
  }
}

assoPersil = ["ciboule", "capucine"];

createAssociation("persil", assoPersil);

module.exports = {
  createAssociation: createAssociation,
};
