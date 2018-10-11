const router = require(`express`).Router();
const wizardsGenerator = require(`../generator/wizards-generator`);
const IllegalArgumentError = require(`../error/illegal-argument-error`);
const NotFoundError = require(`../error/not-found-error`);


const wizards = wizardsGenerator.generateEntity();

router.get(``, (req, res) => {
  res.send(wizards);
});


router.get(`/:name`, (req, res) => {
  const wizardName = req.params.name;
  if (!wizardName) {
    throw new IllegalArgumentError(`В запросе не указано имя`);
  }

  const name = wizardName.toLowerCase();
  const found = wizards.find((it) => it.name.toLowerCase() === name);
  if (!found) {
    throw new NotFoundError(`Маг с именем "${wizardName}" не найден`);
  }

  res.send(found);
});

module.exports = router;
