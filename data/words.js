const wordsEasyAnimals = [
    'gato', 'perro', 'loro', 'conejo', 'elefante', 'león', 'tigre', 'oso',
    'caballo', 'vaca', 'cerdo', 'oveja', 'pato', 'gallina', 'mono', 'ratón',
    'pájaro', 'tortuga', 'serpiente', 'pez', 'canguro', 'pingüino', 'cocodrilo',
    'hipopótamo', 'jirafa', 'zebra', 'camello', 'lobo', 'zorro', 'ardilla', 'murciélago',
    'mariposa', 'abeja', 'mosquito', 'hormiga', 'águila', 'halcón', 'cisne', 'flamenco',
    'pavo', 'ciervo', 'rinoceronte', 'búfalo', 'delfín', 'ballena', 'tiburón', 'pulpo', 'medusa', 'erizo',
    'cangrejo', 'foca', 'nutria', 'morsa', 'puma', 'pantera', 'jaguar', 'gorila', 'perezoso', 'mapache', 'castor', 'caracol', 'rana',
    'lagarto', 'camaleón', 'iguana', 'tucán', 'colibrí', 'búho', 'paloma', 'cuervo',
    'avestruz', 'canguro', 'cucaracha', 'escarabajo', 'araña', 'mosca', 'grillo',
];

const wordsAdvancedAnimals = [
    'libélula', 'saltamontes', 'pulga', 'gusano', 'oruga', 'polilla',
    'babosa', 'almeja', 'ostra', 'mejillón', 'calamar', 'langosta', 'camarón', 'anémona',
    'coral', 'medusa', 'albatros', 'gaviota', 'pelícano', 'cormorán', 'ganso',
    'garza', 'cigüeña', 'buitre', 'lechuza', 'koala', 'chimpancé',
    'orangután', 'lemur', 'tejón', 'alce', 'salamandra', 'kiwi', 'emu', 'ornitorrinco', 'wombat', 'dingo', 'equidna',
    'tarsero', 'axolotl', 'tapir', 'okapi', 'fénec', 'kinkajú', 'capirotada', 'caracal', 'cacatúa',
    'narval', 'quokka', 'dugongo', 'pangolín', 'cuscús', 'bilby',
    'mangosta', 'kakapo', 'binturong', 'coati', 'galago', 'quetzal'
];

const wordsEasyColors = [
    'rojo', 'azul', 'verde', 'amarillo', 'naranja', 'rosa', 'morado', 'negro', 'blanco', 'gris', 'marrón'
];

const wordsAdvancedColors = [
    'carmesí', 'escarlata', 'borgoña', 'magenta', 'fucsia', 'lavanda', 'violeta', 'indigo',
    'turquesa', 'cian', 'aguamarina', 'chartreuse', 'lima', 'oliva', 'beige', 'teja', 'ocre',
    'ámbar', 'coral', 'salmón', 'caoba', 'sepia', 'bistre', 'púrpura', 'moca',
    'tan', 'taupe', 'caqui', 'oro', 'plata', 'bronce', 'perla', 'marfil', 'ébano'
];

const wordsEasyFruitsAndVegetables = [
    'manzana', 'banana', 'naranja', 'uva', 'fresa', 'limón', 'tomate', 'zanahoria', 'lechuga',
    'papa', 'cebolla', 'ajo', 'pepino', 'calabaza', 'berenjena', 'mango', 'piña', 'pera', 'durazno',
    'sandía', 'melon', 'kiwi', 'frambuesa', 'mora', 'arandano', 'maíz', 'chile', 'brocoli', 'espinaca'
];

const wordsAdvancedFruitsAndVegetables = [
    'kumquat', 'rambután', 'litchi', 'papaya', 'mangostán', 'pitahaya', 'guanábana', 'maracuyá',
    'carambola', 'durian', 'feijoa', 'pomelo', 'tamarindo', 'acerola', 'jícama', 'yaca', 'yuzu',
    'ugli', 'salak', 'okra', 'rutabaga', 'kohlrabi', 'alcachofa', 'remolacha', 'apio',
    'berro', 'endibia', 'escarola', 'hinojo', 'rábano'
];

const wordsEasySports = [
    'fútbol', 'baloncesto', 'voleibol', 'tenis', 'natación', 'atletismo', 'ciclismo', 'béisbol',
    'golf', 'rugby', 'boxeo', 'hockey', 'fútbol americano', 'gimnasia', 'esquí', 'patinaje', 'judo', 'karate'
];

const wordsAdvancedSports = [
    'curling', 'kabaddi', 'polo', 'críquet', 'squash', 'badminton', 'taekwondo',
    'remo', 'canoaje', 'esgrima', 'halterofilia', 'bobsleigh', 'biatlón', 'triatlón',
    'kitesurf', 'parapente', 'puenting', 'parkour'
];


const allEasyWords = [].concat(wordsEasyAnimals, wordsEasyColors, wordsEasyFruitsAndVegetables, wordsEasySports);
const allAdvancedWords = [].concat(wordsAdvancedAnimals, wordsAdvancedColors, wordsAdvancedFruitsAndVegetables, wordsAdvancedSports);

const shuffledEasyWords = shuffle(allEasyWords);
const shuffledAdvancedWords = shuffle(allAdvancedWords);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {
    wordsEasyAnimals,
    wordsAdvancedAnimals,
    wordsEasyColors,
    wordsAdvancedColors,
    wordsEasyFruitsAndVegetables,
    wordsAdvancedFruitsAndVegetables,
    wordsEasySports,
    wordsAdvancedSports,
    shuffledEasyWords,
    shuffledAdvancedWords
}