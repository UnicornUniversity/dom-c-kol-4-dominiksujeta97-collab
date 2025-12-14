//TODO add imports if needed
//TODO doc

/**
 * The main function which calls the application.
 * Please, add specific description here for the application purpose.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {object} containing the statistics
 */
export function main(dtoIn) {
  //Hlavná funkcia na vytvorenie zoznamu zamestnancov
  let employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

/**
 * Please, add specific description here
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @returns {Array} of employees
 */
export function generateEmployeeData(dtoIn) {
  //Počet zamestnancov, ktorý vytvárame
  let count = dtoIn.count;

  //Minimálny a maximálny vek
  let ageMin = dtoIn.age.min;
  let ageMax = dtoIn.age.max;

  //Zoznam náhodných mien
  let names = [
    "Peter","Martin","Jakub","Samuel","Lukas","Michal","Adam","Tomas","Matej","Dominik",
    "Filip","Patrik","Andrej","Daniel","Erik","Oliver","Marek","Sebastian","Viktor","Roman",
    "Rastislav","Boris","Jan","Simon","David","Karol","Igor","Norbert","Gabriel","Henrich",
    "Lucia","Kristina","Natalia","Ema","Sofia","Laura","Monika","Zuzana","Veronika","Katarina",
    "Eva","Maria","Barbora","Petra","Simona","Nikola","Tamara","Viktoria","Paulina","Lenka"
  ];

  //Zoznam náhodných priezvisk
  let surnames = [
    "Novak","Kovac","Horvath","Varga","Toth","Kucera","Marek","Bartok","Urban","Simek",
    "Kral","Klement","Farkas","Klein","Hruska","Sokol","Baran","Roth","Hlavac","Polak",
    "Ford","Keller","Berger","Cerny","Bielik",
    "Novakova","Kovacova","Horvathova","Vargova","Tothova",
    "Kucerova","Markova","Bartosova","Urbanova","Simkova",
    "Kralova","Klementova","Farkasova","Kleinova","Hruskova",
    "Sokolova","Baranova","Rothova","Hlavacova","Polakova"
  ];

  //Možný pracovný úväzok
  let workloads = [10, 20, 30, 40];

  //Pomocná funkcia pre náhodný výber z poľa
  function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  //Vytvorenie unikátnych dátumov narodenia
  function buildUniqueBirthdates(count, minAge, maxAge) {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let from = new Date(today);
    from.setUTCFullYear(from.getUTCFullYear() - maxAge);

    let to = new Date(today);
    to.setUTCFullYear(to.getUTCFullYear() - minAge);

    let days = [];
    for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(new Date(d).toISOString());
    }

    //zamiešanie dátumov
    for (let i = days.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [days[i], days[j]] = [days[j], days[i]];
    }

    return days.slice(0, count);
  }

  let birthdates = buildUniqueBirthdates(count, ageMin, ageMax);
  let dtoOut = [];

  //Cyklus na vytvorenie náhodných zamestnancov
  for (let i = 0; i < count; i++) {
    let gender = Math.random() < 0.5 ? "male" : "female";

    let employee = {
      gender: gender,
      birthdate: birthdates[i],
      name: pickRandom(names),
      surname: pickRandom(surnames),
      workload: pickRandom(workloads)
    };

    dtoOut.push(employee);
  }

  return dtoOut;
}

/**
 * Please, add specific description here
 * @param {Array} employees containing all the mocked employee data
 * @returns {object} statistics of the employees
 */
export function getEmployeeStatistics(employees) {
  let total = employees.length;

  //počty úväzkov
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  //vek (pracujeme s desatinným číslom)
  let sumAge = 0;
  let minAgeDec = Infinity;
  let maxAgeDec = -Infinity;

  //ženy
  let sumWomenWorkload = 0;
  let countWomen = 0;

  let ages = [];
  let workloads = [];

  for (let e of employees) {
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    let age = getAgeFromIsoDecimal(e.birthdate);

    sumAge += age;
    ages.push(age);
    workloads.push(e.workload);

    if (age < minAgeDec) minAgeDec = age;
    if (age > maxAgeDec) maxAgeDec = age;

    if (e.gender === "female") {
      sumWomenWorkload += e.workload;
      countWomen++;
    }
  }

  //priemerný vek – 1 desatinné miesto
  let averageAge = roundTo1Decimal(sumAge / total);

  //min/max vek – celé čísla
  let minAge = Math.floor(minAgeDec);
  let maxAge = Math.floor(maxAgeDec);

  //mediány
  let medianAge = Math.floor(medianClassic(ages));
  let medianWorkload = medianClassic(workloads);

  //priemer úväzku žien
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = roundTo1Decimal(sumWomenWorkload / countWomen);
  }

  //zoradenie podľa workload
  let sortedByWorkload = employees.slice().sort((a, b) => a.workload - b.workload);

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}

/* =========================
   Pomocné funkcie
   ========================= */

//vek z ISO dátumu
function getAgeFromIsoDecimal(iso) {
  let birth = new Date(iso);
  birth.setUTCHours(0, 0, 0, 0);

  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return (today - birth) / (365.25 * 24 * 60 * 60 * 1000);
}

function roundTo1Decimal(x) {
  return Math.round(x * 10) / 10;
}

//medián (pri párnom = priemer dvoch stredných)
function medianClassic(arr) {
  let a = arr.slice().sort((x, y) => x - y);
  let mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}