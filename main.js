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

  //Zoznam náhodných mužských mien 
  let maleNames = [
    "Peter", "Martin", "Jakub", "Samuel", "Lukas", "Michal", "Adam", "Tomas", "Matej", "Dominik",
    "Filip", "Patrik", "Andrej", "Daniel", "Erik", "Oliver", "Marek", "Sebastian", "Viktor", "Roman",
    "Rastislav", "Boris", "Jan", "Simon", "David", "Karol", "Igor", "Norbert", "Gabriel", "Henrich",
    "Juraj", "Robert", "Stefan", "Milan", "Pavol", "Ladislav", "Radovan", "Jaroslav", "Lubomir", "Alojz",
    "Vladimir", "Richard", "Marian", "Alexej", "Teodor", "Eduard", "Arpad", "Frantisek", "Ondrej", "Mateo"
  ];

  //Zoznam náhodných ženských mien 
  let femaleNames = [
    "Lucia", "Kristina", "Natalia", "Ema", "Sofia", "Laura", "Monika", "Zuzana", "Veronika", "Katarina",
    "Eva", "Maria", "Barbora", "Petra", "Simona", "Nikola", "Tamara", "Viktoria", "Paulina", "Lenka",
    "Jana", "Ivana", "Michaela", "Andrea", "Denisa", "Alena", "Martina", "Dominika", "Alexandra", "Patricia",
    "Klaudia", "Nina", "Karina", "Adriana", "Helena", "Renata", "Tatiana", "Silvia", "Elena", "Olivia",
    "Timea", "Dorota", "Aneta", "Beata", "Bianka", "Emilia", "Magdalena", "Stela", "Diana", "Viera"
  ];

  //Zoznam náhodných mužských priezvisk 
  let maleSurnames = [
    "Novak", "Kovac", "Horvath", "Varga", "Toth", "Kucera", "Marek", "Bartok", "Urban", "Simek",
    "Kral", "Klement", "Farkas", "Klein", "Hruska", "Sokol", "Baran", "Roth", "Hlavac", "Polak",
    "Ford", "Keller", "Berger", "Cerny", "Bielik",
    "Molnar", "Balaz", "Kadlec", "Nemec", "Pavlik",
    "Blaha", "Svoboda", "Dvorak", "Kratochvil", "Sedlak",
    "Benko", "Bartos", "Chovanec", "Jelinek", "Kolar",
    "Kostka", "Mikulas", "Zeman", "Stanek", "Kriz"
  ];

  //Zoznam náhodných ženských priezvisk 
  let femaleSurnames = [
    "Novakova", "Kovacova", "Horvathova", "Vargova", "Tothova",
    "Kucerova", "Markova", "Bartosova", "Urbanova", "Simkova",
    "Kralova", "Klementova", "Farkasova", "Kleinova", "Hruskova",
    "Sokolova", "Baranova", "Rothova", "Hlavacova", "Polakova",
    "Molnarova", "Balazova", "Kadlecova", "Nemcova", "Pavlikova",
    "Blahova", "Svobodova", "Dvorakova", "Kratochvilova", "Sedlakova",
    "Benkova", "Bartosova2", "Chovancova", "Jelinekova", "Kolarova",
    "Kostkova", "Mikulasova", "Zemanova", "Stankova", "Krizova",
    "Krejcova", "Pokorna", "Vesela", "Prochazkova", "Holubova",
    "Ruzickova", "Rybarova", "Liskova", "Kovacikova", "Stanekova"
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
  // (robím to cez náhodný dátum medzi hranicami, aby testy vždy sedeli)
  function generateBirthdate(minAge, maxAge) {
    while (true) {
      let now = new Date();

      // najstarší povolený (maxAge rokov dozadu)
      let oldest = new Date(now);
      oldest.setUTCFullYear(oldest.getUTCFullYear() - maxAge);

      // najmladší povolený (minAge rokov dozadu)
      let youngest = new Date(now);
      youngest.setUTCFullYear(youngest.getUTCFullYear() - minAge);

      // náhodný čas medzi oldest a youngest
      let minTime = oldest.getTime();
      let maxTime = youngest.getTime();
      let randomTime = minTime + Math.random() * (maxTime - minTime);

      let birthday = new Date(randomTime);
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
  // (kopírujem aj objekty, aby som nemal referencie na pôvodné)
  let sortedByWorkload = employees.map(function (e) {
    return {
      gender: e.gender,
      birthdate: e.birthdate,
      name: e.name,
      surname: e.surname,
      workload: e.workload
    };
  });

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