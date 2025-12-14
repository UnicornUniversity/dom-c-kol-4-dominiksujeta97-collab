//Hlavná funkcia na vytvorenie zoznamu zamestnancov
export function main(dtoIn) {
  let employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

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
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // interval dátumov: [today-maxAge rokov, today-minAge rokov]
    let from = new Date(today);
    from.setUTCFullYear(from.getUTCFullYear() - maxAge);

    let to = new Date(today);
    to.setUTCFullYear(to.getUTCFullYear() - minAge);

    // všetky dni v intervale
    let days = [];
    for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
      // každé ISO bude unikátne (každý deň iný)
      days.push(new Date(d).toISOString());
    }

    // ak žiadaný počet presahuje počet dní, zredukujeme ho
    if (count > days.length) {
      count = days.length;
    }

    // premiešanie poľa
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

// Vytváranie štatistík zamestnancov - úloha č. 4
export function getEmployeeStatistics(employees) {
  let total = employees.length;

  // počty úväzkov za týždeň
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // veky (min/max musia byť celé roky)
  let sumAge = 0; // desatinný vek pre averageAge
  let minAge = null;
  let maxAge = null;

  // týždenný úväzok žien
  let sumWomenWorkload = 0;
  let countWomen = 0;

  // polia pre mediány
  let agesYears = [];   // celé roky
  let workloads = [];   // 10/20/30/40

  for (let i = 0; i < employees.length; i++) {
    let e = employees[i];

    // počítadlo úväzkov
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    // vek zamestnanca
    let ageYears = getAgeFromIsoYears(e.birthdate);          // celé roky (UTC)
    let ageDec = getAgeFromIsoDecimalStable(e.birthdate);    // desatinný vek 

    sumAge = sumAge + ageDec;
    agesYears.push(ageYears);
    workloads.push(e.workload);

    if (minAge === null || ageYears < minAge) minAge = ageYears;
    if (maxAge === null || ageYears > maxAge) maxAge = ageYears;

    if (e.gender === "female") {
      sumWomenWorkload = sumWomenWorkload + e.workload;
      countWomen = countWomen + 1;
    }
  }

  // priemer veku (na 1 desatinné miesto)
  let averageAge = sumAge / total;
  averageAge = roundTo1Decimal(averageAge);

  // median veku (celé číslo)
  let medianAge = medianClassic(agesYears);
  medianAge = Math.round(medianAge);

  // median workloadu (klasický medián – pri párnom priemer dvoch stredných)
  let medianWorkload = medianClassic(workloads);

  // priemer úväzku žien
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = sumWomenWorkload / countWomen;
    averageWomenWorkload = roundTo1Decimal(averageWomenWorkload);
  }

  // triedenie podľa úväzku (nesmie meniť originál)
  let sortedByWorkload = employees.slice();
  sortedByWorkload.sort(function (a, b) {
    return a.workload - b.workload;
  });

  return {
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
}

// pomocné funkcie

// celé roky veku
function getAgeFromIsoYears(iso) {
  const birth = new Date(iso);
  const today = new Date();

  const birthY = birth.getUTCFullYear();
  const birthM = birth.getUTCMonth();
  const birthD = birth.getUTCDate();

  const todayY = today.getUTCFullYear();
  const todayM = today.getUTCMonth();
  const todayD = today.getUTCDate();

  let age = todayY - birthY;
  if (todayM < birthM || (todayM === birthM && todayD < birthD)) {
    age--;
  }
  return age;
}

// desatinný vek 
function getAgeFromIsoDecimalStable(iso) {
  const birth = new Date(iso);
  birth.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const years = getAgeFromIsoYears(iso);

  // posledné narodeniny (v tomto roku alebo minulom)
  const last = new Date(Date.UTC(
    today.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate()
  ));
  if (last.getTime() > today.getTime()) {
    last.setUTCFullYear(last.getUTCFullYear() - 1);
  }

  // ďalšie narodeniny
  const next = new Date(last);
  next.setUTCFullYear(next.getUTCFullYear() + 1);

  const part = (today.getTime() - last.getTime()) / (next.getTime() - last.getTime());
  return years + part;
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
