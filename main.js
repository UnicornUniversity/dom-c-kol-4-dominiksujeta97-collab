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

// Štatistiky – úloha č. 4
export function getEmployeeStatistics(employees) {

  let total = employees.length;

  // Počty úväzkov
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // Veky
  let sumAge = 0;
  let minAge = Infinity;
  let maxAge = -Infinity;

  // Úväzky žien
  let sumWomenWorkload = 0;
  let countWomen = 0;

  // Polia pre mediány
  let ages = [];
  let workloads = [];

  for (let i = 0; i < employees.length; i++) {
    let e = employees[i];

    // Počítanie úväzkov
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    // Výpočet veku 
    let age = getAgeFromIso(e.birthdate);

    sumAge += age;
    ages.push(age);
    workloads.push(e.workload);

    if (age < minAge) minAge = age;
    if (age > maxAge) maxAge = age;

    if (e.gender === "female") {
      sumWomenWorkload += e.workload;
      countWomen++;
    }
  }

  // Priemerný vek 
  let averageAge = Math.round((sumAge / total) * 10) / 10;

  // Medián veku 
  let medianAge = Math.round(getMedian(ages));

  // Medián úväzkov 
  let medianWorkload = getMedian(workloads);

  // Priemer úväzku žien
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = Math.round((sumWomenWorkload / countWomen) * 10) / 10;
  }

  // Zoradenie podľa úväzku
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


// Pomocné funkcie
// Výpočet veku
function getAgeFromIso(iso) {
  const birth = new Date(iso);
  const today = new Date();

  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const m = today.getUTCMonth() - birth.getUTCMonth();

  if (m < 0 || (m === 0 && today.getUTCDate() < birth.getUTCDate())) {
    age--;
  }
  return age;
}

// Klasický medián
function getMedian(arr) {
  let a = arr.slice().sort((x, y) => x - y);
  let mid = Math.floor(a.length / 2);

  if (a.length % 2 === 1) {
    return a[mid];
  }
  return (a[mid - 1] + a[mid]) / 2;
}