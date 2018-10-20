'use strict';

const Color = require(`../../src/data/color`);


const Boots = [{
  'name': `converse`,
  'description': `Кеды »Конверс« — не делают ничего, просто придают крутой вид`,
  'kind': `footwear`
}, {
  'name': `flying_boots`,
  'description': `Летающие сапоги — придают скорости`,
  'kind': `footwear`
}, {
  'name': `metal_boots`,
  'description': `Металлические сапоги — замедляют`,
  'kind': `footwear`
}];


const Levitation = [{
  'name': `balloon`,
  'description': `Воздушный шарик — увеличивает скорость подъема и уменьшает скорость спуска`,
  'kind': `levitation`
}, {
  'name': `weights`,
  'description': `Утяжелители на ноги — уменьшают скорость подъема и увелилчивают скорость спуска`,
  'kind': `levitation`
}, {
  'name': `wings`,
  'description': `Крылья — позволяют летать без ограничений. При подъеме не происходит автоматического спуска. Чтобы спуститься, нужно нарочно направить волшебника вниз`,
  'kind': `levitation`
}];


const Fireballs = [{
  'name': `triple_fireballs`,
  'description': `Выпускает по три фаербола в разные стороны`,
  'kind': `fireball`
}, {
  'name': `smaller_fireballs`,
  'description': `Выпускает фаерболы меньшего размера, но летящие в два раза быстрее, чем обычные`,
  'kind': `fireball`
}, {
  'name': `bigger_fireballs`,
  'description': `Выпускает увеличенные в два раза фаерболы, которые летают в полтора раза медленнее`,
  'kind': `fireball`
}];


const getArtifacts = () => Boots
    .concat(Levitation)
    .concat(Fireballs)
    .filter(() => Math.random() > 0.25)
    .sort((a, b) => Math.random() > 0.25 ? a - b : b - a);


function* namesGenerator(names) {
  while (names.length > 0) {
    const nameIndex = Math.floor(Math.random() * names.length);
    yield names.splice(nameIndex, 1)[0];
  }
}


const names = namesGenerator([
  `Григорий Распутин`,
  `Гендальф Белый`,
  `Гендальф Серый`,
  `Саурон`,
  `Гарри Поттер`,
  `Волдеморт`,
  `Дамблдор`,
  `Дэвид Блэйн`,
  `Алистер Кроули`,
  `Гарри Гудини`,
  `Мерлин`,
  `Фея Крестная`,
  `Джинни`,
  `Доктор Стрендж`,
  `Старик Хоттабыч`,
  `Антон Городецкий`,
  `Ведьма Пустоши`
]);

const generatedNames = [...names];

const getRandomFromArr = (arr) => arr[Math.floor(arr.length * Math.random())];

const generateEntity = () => generatedNames.map((name) => ({
  'username': name,
  'colorCoat': getRandomFromArr(Color.COAT),
  'colorEyes': getRandomFromArr(Color.EYES),
  'colorFireball': getRandomFromArr(Color.FIREBALL),
  'artifacts': getArtifacts()
}));

module.exports = {
  generateEntity
};
