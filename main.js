// Hlavná funkcia
export function main(dtoIn) {
  let employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

// Generovanie zoznamu zamestnancov – úloha č. 3
export function generateEmployeeData(dtoIn) {

  // Počet zamestnancov
  let count = dtoIn.count;

  // Minimálny a maximálny vek
  let minAge = dtoIn.age.min;
  let maxAge = dtoIn.age.max;

  // Ošetrenie random vstupu (môže nastať min > max)
  if (minAge > maxAge) {
    let tmp = minAge;
    minAge = maxAge;
    maxAge = tmp;
  }

  // Zoznam náhodných mien
  let names = [
    "Peter", "Martin", "Jakub", "Samuel", "Lukas", "Michal", "Adam", "Tomas", "Matej", "Dominik",
    "Filip", "Patrik", "Andrej", "Daniel", "Erik", "Oliver", "Marek", "Sebastian", "Viktor", "Roman",
    "Rastislav", "Boris", "Jan", "Simon", "David", "Karol", "Igor", "Norbert", "Gabriel", "Henrich",
    "Lucia", "Kristina", "Natalia", "Ema", "Sofia", "Laura", "Monika", "Zuzana", "Veronika", "Katarina",
    "Eva", "Maria", "Barbora", "Petra", "Simona", "Nikola", "Tamara", "Viktoria", "Paulina", "Lenka"
  ];

  // Zoznam náhodných priezvisk
  let surnames = [
    "Novak", "Kovac", "Horvath", "Varga", "Toth", "Kucera", "Marek", "Bartok", "Urban", "Simek",
    "Kral", "Klement", "Farkas", "Klein", "Hruska", "Sokol", "Baran", "Roth", "Hlavac", "Polak",
    "Ford", "Keller", "Berger", "Cerny", "Bielik",
    "Novakova", "Kovacova", "Horvathova", "Vargova", "Tothova",
    "Kucerova", "Markova", "Bartosova", "Urbanova", "Simkova",
    "Kralova", "Klementova", "Farkasova", "Kleinova", "Hruskova",
    "Sokolova", "Baranova", "Rothova", "Hlavacova", "Polakova"
  ];

  // Možné pracovné úväzky
  let workloads = [10, 20, 30, 40];

  // Náhodný výber z poľa
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Vytvorenie unikátnych dátumov narodenia
  // Dnešný deň
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Interval dátumov podľa veku
  let from = new Date(today);
  from.setUTCFullYear(from.getUTCFullYear() - maxAge);

  let to = new Date(today);
  to.setUTCFullYear(to.getUTCFullYear() - minAge);

  // Všetky možné dni v intervale
  let days = [];
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(new Date(d).toISOString());
  }

  // Zamiešanie dátumov
  for (let i = days.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = days[i];
    days[i] = days[j];
    days[j] = tmp;
  }

  // Vytvorenie zamestnancov
  let employees = [];

  for (let i = 0; i < count; i++) {
    employees.push({
      gender: Math.random() < 0.5 ? "male" : "female",
      birthdate: days[i],
      name: pickRandom(names),
      surname: pickRandom(surnames),
      workload: pickRandom(workloads)
    });
  }

  return employees;
}

// Vytváranie štatistík zamestnancov - úloha č. 4
export function getEmployeeStatistics(employees) {

  let total = employees.length;

  // počty úväzkov za týždeň
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // vek 
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

    // vek zamestnanca z ISO dátumu narodenia (desatinný vek)
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

  // priemer veku 
  let averageAge = sumAge / total;
  averageAge = roundTo1Decimal(averageAge);

  // min/max vek 
  let minAge = Math.round(minAgeDec);
  let maxAge = Math.round(maxAgeDec);

  // medián veku 
  let medianAge = medianClassic(ages);
  medianAge = Math.round(medianAge);

  // medián úväzkov (klasický medián – pri párnom priemer dvoch stredných)
  let medianWorkload = medianClassic(workloads);

  // priemer úväzku žien (0 ak nie sú ženy)
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = sumWomenWorkload / countWomen;
    averageWomenWorkload = roundTo1Decimal(averageWomenWorkload);
  }

  // triedenie podľa úväzku 
  let sortedByWorkload = employees.slice();
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