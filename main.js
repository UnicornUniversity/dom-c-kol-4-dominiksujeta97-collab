//TODO add imports if needed
//TODO doc

/**
 * Hlavná funkcia aplikácie.
 * Vytvorí zoznam zamestnancov a vypočíta štatistiky.
 *
 * @param {object} dtoIn obsahuje počet zamestnancov a vekové rozpätie {min, max}
 * @returns {object} výstupné štatistiky
 */
export function main(dtoIn) {
  // Vygenerovanie zamestnancov
  let employees = generateEmployeeData(dtoIn);

  // Výpočet štatistík
  let dtoOut = getEmployeeStatistics(employees);

  return dtoOut;
}

/**
 * Generovanie zoznamu zamestnancov – úloha č. 3
 *
 * @param {object} dtoIn obsahuje počet zamestnancov a vekové rozpätie {min, max}
 * @returns {Array} pole zamestnancov
 */
export function generateEmployeeData(dtoIn) {
  // Počet zamestnancov, ktorých vytvárame
  let count = dtoIn.count;

  // Minimálny a maximálny vek
  let ageMin = dtoIn.age.min;
  let ageMax = dtoIn.age.max;

  // Zoznam náhodných mien
  let names = [
    "Peter","Martin","Jakub","Samuel","Lukas","Michal","Adam","Tomas","Matej","Dominik",
    "Filip","Patrik","Andrej","Daniel","Erik","Oliver","Marek","Sebastian","Viktor","Roman",
    "Rastislav","Boris","Jan","Simon","David","Karol","Igor","Norbert","Gabriel","Henrich",
    "Lucia","Kristina","Natalia","Ema","Sofia","Laura","Monika","Zuzana","Veronika","Katarina",
    "Eva","Maria","Barbora","Petra","Simona","Nikola","Tamara","Viktoria","Paulina","Lenka"
  ];

  // Zoznam náhodných priezvisk
  let surnames = [
    "Novak","Kovac","Horvath","Varga","Toth","Kucera","Marek","Bartok","Urban","Simek",
    "Kral","Klement","Farkas","Klein","Hruska","Sokol","Baran","Roth","Hlavac","Polak",
    "Novakova","Kovacova","Horvathova","Vargova","Tothova","Kucerova","Markova","Bartosova",
    "Urbanova","Simkova","Kralova","Klementova","Farkasova","Kleinova","Hruskova",
    "Sokolova","Baranova","Rothova","Hlavacova","Polakova"
  ];

  // Možné pracovné úväzky
  let workloads = [10, 20, 30, 40];

  // Náhodný výber z poľa
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Vytvorenie unikátnych dátumov narodenia v zadanom vekovom rozpätí
   * Používa UTC, aby nevznikali chyby medzi rôznymi časovými pásmami
   */
  function buildUniqueBirthdates(count, minAge, maxAge) {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Najstarší možný dátum
    let from = new Date(today);
    from.setUTCFullYear(from.getUTCFullYear() - maxAge);

    // Najmladší možný dátum
    let to = new Date(today);
    to.setUTCFullYear(to.getUTCFullYear() - minAge);

    // Všetky dni v intervale
    let days = [];
    for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
      days.push(new Date(d).toISOString());
    }

    // Zamiešanie dátumov 
    for (let i = days.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [days[i], days[j]] = [days[j], days[i]];
    }

    return days.slice(0, count);
  }

  // Vytvorenie unikátnych dátumov narodenia
  let birthdates = buildUniqueBirthdates(count, ageMin, ageMax);

  // Výstupný zoznam zamestnancov
  let dtoOut = [];

  // Cyklus na vytvorenie zamestnancov
  for (let i = 0; i < count; i++) {
    // Náhodné pohlavie
    let gender = Math.random() < 0.5 ? "male" : "female";

    let employee = {
      gender: gender,
      name: pickRandom(names),
      surname: pickRandom(surnames),
      birthdate: birthdates[i],
      workload: pickRandom(workloads)
    };

    dtoOut.push(employee);
  }

  return dtoOut;
}

/**
 * Vytváranie štatistík zamestnancov – úloha č. 4
 *
 * @param {Array} employees zoznam zamestnancov
 * @returns {object} štatistiky zamestnancov
 */
export function getEmployeeStatistics(employees) {
  let total = employees.length;

  // Počty úväzkov
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // Premenné pre výpočet veku
  let sumAge = 0;
  let minAge = Infinity;
  let maxAge = -Infinity;

  // Štatistiky pre ženy
  let sumWomenWorkload = 0;
  let countWomen = 0;

  // Polia pre mediány
  let ages = [];
  let workloads = [];

  for (let e of employees) {
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    // Výpočet veku zamestnanca
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
  let averageAge = sumAge / total;

  // Mediány
  let medianAge = Math.round(medianClassic(ages));
  let medianWorkload = medianClassic(workloads);

  // Priemerný úväzok žien
  let averageWomenWorkload =
    countWomen === 0 ? 0 : Math.round((sumWomenWorkload / countWomen) * 10) / 10;

  // Triedenie podľa úväzku
  let sortedByWorkload = employees.slice().sort((a, b) => a.workload - b.workload);

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge: Math.floor(minAge),
    maxAge: Math.floor(maxAge),
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}

/* ================= Pomocné funkcie ================= */

/**
 * Výpočet veku z ISO dátumu (UTC-safe)
 */
function getAgeFromIso(iso) {
  const birth = new Date(iso);
  const today = new Date();

  let age = today.getUTCFullYear() - birth.getUTCFullYear();

  if (
    today.getUTCMonth() < birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() &&
      today.getUTCDate() < birth.getUTCDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Klasický medián (pri párnom počte priemer dvoch stredných)
 */
function medianClassic(arr) {
  let a = arr.slice().sort((x, y) => x - y);
  let mid = Math.floor(a.length / 2);

  return a.length % 2 === 0
    ? (a[mid - 1] + a[mid]) / 2
    : a[mid];
}