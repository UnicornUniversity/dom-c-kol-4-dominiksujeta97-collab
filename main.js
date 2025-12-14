//TODO add imports if needed
//TODO doc

/**
 * The main function which calls the application.
 * Please, add specific description here for the application purpose.
 *
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */

//Hlavná funkcia na vytvorenie zoznamu zamestnancov
export function main(dtoIn) {
  let employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

/**
 * Please, add specific description here
 *
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */

// Generovanie zoznamu zamestnancov - úloha č. 3
export function generateEmployeeData(dtoIn) {
  //Počet zamestnancov, ktorý vytvárame
  let count = dtoIn.count;

  //Minimálny a maximálny vek
  let ageMin = dtoIn.age.min;
  let ageMax = dtoIn.age.max;

  //Zoznam náhodných mien 
  let names = [
    "Peter", "Martin", "Jakub", "Samuel", "Lukas", "Michal", "Adam", "Tomas", "Matej", "Dominik",
    "Filip", "Patrik", "Andrej", "Daniel", "Erik", "Oliver", "Marek", "Sebastian", "Viktor", "Roman",
    "Rastislav", "Boris", "Jan", "Simon", "David", "Karol", "Igor", "Norbert", "Gabriel", "Henrich",
    "Lucia", "Kristina", "Natalia", "Ema", "Sofia", "Laura", "Monika", "Zuzana", "Veronika", "Katarina",
    "Eva", "Maria", "Barbora", "Petra", "Simona", "Nikola", "Tamara", "Viktoria", "Paulina", "Lenka"
  ];

  //Zoznam náhodných priezvisk 
  let surnames = [
    "Novak", "Kovac", "Horvath", "Varga", "Toth", "Kucera", "Marek", "Bartok", "Urban", "Simek",
    "Kral", "Klement", "Farkas", "Klein", "Hruska", "Sokol", "Baran", "Roth", "Hlavac", "Polak",
    "Ford", "Keller", "Berger", "Cerny", "Bielik",
    "Novakova", "Kovacova", "Horvathova", "Vargova", "Tothova",
    "Kucerova", "Markova", "Bartosova", "Urbanova", "Simkova",
    "Kralova", "Klementova", "Farkasova", "Kleinova", "Hruskova",
    "Sokolova", "Baranova", "Rothova", "Hlavacova", "Polakova"
  ];

  //Možný pracovný úväzok
  let workloads = [10, 20, 30, 40];

  //Funkcia pre náhodný výber z poľa
  function pickRandom(list) {
    let index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  //Funkcia na vytvorenie unikátnych dátumov narodenia v zadanom vekovom rozmedzí
  //Prevod do ISO formátu
  function buildUniqueBirthdates(count, minAge, maxAge) {
    // "dnes" na UTC polnoc (stabilné medzi prostrediami)
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // interval dátumov narodenia
    let from = new Date(today);
    from.setUTCFullYear(from.getUTCFullYear() - maxAge);

    let to = new Date(today);
    to.setUTCFullYear(to.getUTCFullYear() - minAge);

    // všetky dni v intervale
    let days = [];
    for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(new Date(d).toISOString()); // každý deň unikát
    }

    // bezpečnosť, keby niekto chcel viac ľudí ako dní v intervale
    if (count > days.length) {
      count = days.length;
    }

    // zamiešanie dní 
    for (let i = days.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = days[i];
      days[i] = days[j];
      days[j] = tmp;
    }

    return days.slice(0, count);
  }

  //vytvorenie unikátnych dátumov narodenia
  let birthdates = buildUniqueBirthdates(count, ageMin, ageMax);

  //Výstup
  let dtoOut = [];

  //Cyklus na vytvorenie náhodnych zamestnancov
  for (let i = 0; i < count; i++) {
    //pohlavie
    let gender;
    if (Math.random() < 0.5) {
      gender = "male";
    } else {
      gender = "female";
    }

    let name = pickRandom(names);
    let surname = pickRandom(surnames);
    let birthdate = birthdates[i]; // unikátne ISO dátumy
    let workload = pickRandom(workloads);

    //Vytvorenie zamestnanaca
    let employee = {
      gender: gender,
      birthdate: birthdate,
      name: name,
      surname: surname,
      workload: workload
    };

    dtoOut.push(employee); //Pridáme do generovaného výstupneho zoznamu
  }

  return dtoOut;
}

/**
 * Please, add specific description here
 *
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */

// Vytváranie štatistík zamestnancov - úloha č. 4
export function getEmployeeStatistics(employees) {
  let total = employees.length;

  // počty úväzkov za týždeň
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // vek
  let sumAge = 0;
  let minAgeDec = Infinity;
  let maxAgeDec = -Infinity;

  // týždenný úväzok žien
  let sumWomenWorkload = 0;
  let countWomen = 0;

  // polia pre mediány
  let ages = [];
  let workloads = [];

  for (let i = 0; i < employees.length; i++) {
    let e = employees[i];

    // počítadlo úväzkov
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    // vek zamestnanca z ISO dátumu narodenia 
    let age = getAgeFromIsoDecimal(e.birthdate);

    sumAge = sumAge + age;
    ages.push(age);
    workloads.push(e.workload);

    if (age < minAgeDec) minAgeDec = age;
    if (age > maxAgeDec) maxAgeDec = age;

    if (e.gender === "female") {
      sumWomenWorkload = sumWomenWorkload + e.workload;
      countWomen = countWomen + 1;
    }
  }

  // priemer veku (zaokrúhlený práve na 1 desatinné číslo)
  let averageAge = sumAge / total;
  averageAge = roundTo1Decimal(averageAge);

  // minAge, maxAge a medianAge sú zaokrúhlené na celé čísla
  let minAge = Math.round(minAgeDec);
  let maxAge = Math.round(maxAgeDec);

  // median veku (najprv klasický medián, potom zaokrúhliť na celé číslo)
  let medianAge = medianClassic(ages);
  medianAge = Math.round(medianAge);

  // median výšky úväzku 
  let medianWorkload = medianClassic(workloads);
  medianWorkload = Math.round(medianWorkload);

  // priemernú výšku úväzku v rámci žien 
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = sumWomenWorkload / countWomen;
    averageWomenWorkload = roundTo1Decimal(averageWomenWorkload);
  }

  // zoznam zamestnancov zotriedených podľa výsky úväzku
  let sortedByWorkload = employees.slice(); // kópia (aby sme nemenili originál)
  sortedByWorkload.sort(function (a, b) {
    return a.workload - b.workload;
  });

  let dtoOut = {
    total: total,
    workload10: workload10,
    workload20: workload20,
    workload30: workload30,
    workload40: workload40,
    averageAge: averageAge,
    minAge: minAge,
    maxAge: maxAge,
    medianAge: medianAge,
    medianWorkload: medianWorkload,
    averageWomenWorkload: averageWomenWorkload,
    sortedByWorkload: sortedByWorkload
  };

  return dtoOut;
}

// pomocné funkcie

// vek z ISO dátumu narodenia 
function getAgeFromIsoDecimal(iso) {
  let birth = new Date(iso);
  birth.setUTCHours(0, 0, 0, 0);

  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let diffMs = today.getTime() - birth.getTime();
  let years = diffMs / (365.25 * 24 * 60 * 60 * 1000);
  return years;
}

function roundTo1Decimal(x) {
  return Math.round(x * 10) / 10;
}

// medián (pri párnom = priemer 2 stredných)
function medianClassic(arr) {
  let a = arr.slice();
  a.sort(function (x, y) {
    return x - y;
  });

  let n = a.length;
  let mid = Math.floor(n / 2);

  if (n % 2 === 1) {
    return a[mid];
  } else {
    return (a[mid - 1] + a[mid]) / 2;
  }
}