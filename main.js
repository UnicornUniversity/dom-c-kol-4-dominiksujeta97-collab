//Hlavná funkcia na vytvorenie zoznamu zamestnancov
export function main(dtoIn) {
  let employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

// Generovanie zoznamu zamestnancov - úloha č. 3

function generateEmployeeData(dtoIn) {
  //Počet zamestnancov, ktorý vytvárame
  let count = dtoIn.count;

  //Minimálny a maximálny vek
  let ageMin = dtoIn.age.min;
  let ageMax = dtoIn.age.max;

  //Zoznam náhodných mužských mien (25) + ženských mien (25)
  let maleNames = [
    "Peter", "Martin", "Jakub", "Samuel", "Lukas",
    "Michal", "Adam", "Tomas", "Matej", "Dominik",
    "Filip", "Patrik", "Andrej", "Daniel", "Erik",
    "Oliver", "Marek", "Sebastian", "Viktor", "Roman",
    "Juraj", "Robert", "Stefan", "Milan", "Pavol"
  ];

  let femaleNames = [
    "Lucia", "Kristina", "Natalia", "Ema", "Sofia",
    "Laura", "Monika", "Zuzana", "Veronika", "Katarina",
    "Eva", "Maria", "Barbora", "Petra", "Simona",
    "Nikola", "Tamara", "Viktoria", "Paulina", "Lenka",
    "Jana", "Ivana", "Michaela", "Andrea", "Denisa"
  ];

  //Zoznam náhodných mužských priezvisk (25) + ženských priezvisk (25) 
  let maleSurnames = [
    "Novak", "Kovac", "Horvath", "Varga", "Toth",
    "Kucera", "Marek", "Urban", "Simek", "Kral",
    "Klement", "Farkas", "Klein", "Hruska", "Sokol",
    "Baran", "Roth", "Hlavac", "Polak", "Ford",
    "Keller", "Berger", "Cerny", "Bielik", "Nemec"
  ];

  let femaleSurnames = [
    "Novakova", "Kovacova", "Horvathova", "Vargova", "Tothova",
    "Kucerova", "Markova", "Urbanova", "Simkova", "Kralova",
    "Klementova", "Farkasova", "Kleinova", "Hruskova", "Sokolova",
    "Baranova", "Rothova", "Hlavacova", "Polakova", "Nemcova",
    "Bielikova", "Cernyova", "Bergerova", "Kellerova", "Fordova"
  ];

  //Možný pracovný úväzok
  let workloads = [10, 20, 30, 40];

  //Funkcia pre náhodný výber z poľa
  function pickRandom(list) {
    let index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  //Set na už použité dátumy narodenia - zabezpečenie jedinečnosti
  let usedBirthdates = new Set();

  //Funkcia na výpočet veku z dátumu s púrevodom na milisekundy
  function getAgeFromDate(date) {
    let diffMs = Date.now() - date.getTime();
    let years = diffMs / (365.25 * 24 * 60 * 60 * 1000);
    return years;
  }

  //Funkcia na generovanie jedinečného dátumu narodenia v zadanom vekovom rozmedzí
  //Prevod do ISO formátu
  function generateBirthdate(minAge, maxAge) {
    while (true) {
      let age = minAge + Math.random() * (maxAge - minAge);

      let diffMs = age * 365.25 * 24 * 60 * 60 * 1000;
      let birthday = new Date(Date.now() - diffMs);
      birthday.setUTCHours(0, 0, 0, 0);

      let iso = birthday.toISOString();

      if (usedBirthdates.has(iso)) {
        continue;
      }

      //Overenie veku (vrátane hraníc)
      let realAge = getAgeFromDate(birthday);
      if (realAge >= minAge && realAge <= maxAge) {
        usedBirthdates.add(iso);
        return iso;
      }
    }
  }

  //Výstup
  let dtoOut = [];

  //Cyklus na vytvorenie náhodnych zamestnancov
  for (let i = 0; i < count; i++) {
    let gender;
    if (Math.random() < 0.5) {
      gender = "male";
    } else {
      gender = "female";
    }

    let name;
    let surname;

    //Vyber mena a priezviska podľa pohlavia
    if (gender === "male") {
      name = pickRandom(maleNames);
      surname = pickRandom(maleSurnames);
    } else {
      name = pickRandom(femaleNames);
      surname = pickRandom(femaleSurnames);
    }

    let birthdate = generateBirthdate(ageMin, ageMax);
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

// Vytváranie štatistík zamestnancov - úloha č. 4

function getEmployeeStatistics(employees) {
  let total = employees.length;

  // počty pracovných úväzkov
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // veky
  let sumAge = 0;
  let minAge = null;
  let maxAge = null;

  // výška úväzku žien
  let sumWomenWorkload = 0;
  let countWomen = 0;

  // polia na mediány
  let ages = [];
  let workloads = [];

  for (let i = 0; i < employees.length; i++) {
    let e = employees[i];

    // počítadlo úväzkov
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    // vek z ISO dátumu narodenia
    let age = getAgeFromIso(e.birthdate);
    sumAge = sumAge + age;

    ages.push(age);
    workloads.push(e.workload);

    if (minAge === null || age < minAge) minAge = age;
    if (maxAge === null || age > maxAge) maxAge = age;

    if (e.gender === "female") {
      sumWomenWorkload = sumWomenWorkload + e.workload;
      countWomen = countWomen + 1;
    }
  }

  // priemerný vek (na 1 desatinné miesto)
  let averageAge = sumAge / total;
  averageAge = roundTo1Decimal(averageAge);

  // min/max vek (celé čísla)
  minAge = Math.round(minAge);
  maxAge = Math.round(maxAge);

  // median vek (celé číslo)
  let medianAge = medianClassic(ages);
  medianAge = Math.round(medianAge);

  // median úväzkov (dolný stred = vždy 10/20/30/40)
  let medianWorkload = medianLowerMiddle(workloads);

  // priemer výšky úväzkov pre ženy (1 desatinné alebo celé číslo)
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = sumWomenWorkload / countWomen;
    averageWomenWorkload = roundTo1Decimal(averageWomenWorkload);
  }

  // zoznam zamestnancov zotriedený podľa výšky úväzku od najmenšieho po najväčší
  let sortedByWorkload = employees.slice();
  sortedByWorkload.sort(function (a, b) {
    return a.workload - b.workload;
  });

  //Výstup
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
function getAgeFromIso(iso) {
  let d = new Date(iso);
  let diffMs = Date.now() - d.getTime();
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

// medián úvázkov = dolný stred (aby bolo dodržané 10/20/30/40)
function medianLowerMiddle(arr) {
  let a = arr.slice();
  a.sort(function (x, y) {
    return x - y;
  });

  let n = a.length;
  let mid = Math.floor((n - 1) / 2);
  return a[mid];
}