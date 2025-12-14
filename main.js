export function main(dtoIn) {
  let employees = generateEmployeeData(dtoIn);
  let dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}

function generateEmployeeData(dtoIn) {
  let count = dtoIn.count;

  let ageMin = dtoIn.age.min;
  let ageMax = dtoIn.age.max;

  let names = [
    "Peter", "Martin", "Jakub", "Samuel", "Lukas", "Michal", "Adam", "Tomas", "Matej", "Dominik",
    "Filip", "Patrik", "Andrej", "Daniel", "Erik", "Oliver", "Marek", "Sebastian", "Viktor", "Roman",
    "Rastislav", "Boris", "Jan", "Simon", "David", "Karol", "Igor", "Norbert", "Gabriel", "Henrich",
    "Lucia", "Kristina", "Natalia", "Ema", "Sofia", "Laura", "Monika", "Zuzana", "Veronika", "Katarina",
    "Eva", "Maria", "Barbora", "Petra", "Simona", "Nikola", "Tamara", "Viktoria", "Paulina", "Lenka"
  ];

  let surnames = [
    "Novak", "Kovac", "Horvath", "Varga", "Toth", "Kucera", "Marek", "Bartok", "Urban", "Simek",
    "Kral", "Klement", "Farkas", "Klein", "Hruska", "Sokol", "Baran", "Roth", "Hlavac", "Polak",
    "Ford", "Keller", "Berger", "Cerny", "Bielik",
    "Novakova", "Kovacova", "Horvathova", "Vargova", "Tothova",
    "Kucerova", "Markova", "Bartosova", "Urbanova", "Simkova",
    "Kralova", "Klementova", "Farkasova", "Kleinova", "Hruskova",
    "Sokolova", "Baranova", "Rothova", "Hlavacova", "Polakova"
  ];

  let workloads = [10, 20, 30, 40];

  function pickRandom(list) {
    let index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  let usedBirthdates = new Set();

  function getAgeFromDate(date) {
    let diffMs = Date.now() - date.getTime();
    let years = diffMs / (365.25 * 24 * 60 * 60 * 1000);
    return years;
  }

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

      let realAge = getAgeFromDate(birthday);
      if (realAge > minAge && realAge < maxAge) {
        usedBirthdates.add(iso);
        return iso;
      }
    }
  }

  let dtoOut = [];

  for (let i = 0; i < count; i++) {
    let gender;
    if (Math.random() < 0.5) {
      gender = "male";
    } else {
      gender = "female";
    }

    let name = pickRandom(names);
    let surname = pickRandom(surnames);
    let birthdate = generateBirthdate(ageMin, ageMax);
    let workload = pickRandom(workloads);

    let employee = {
      gender: gender,
      birthdate: birthdate,
      name: name,
      surname: surname,
      workload: workload
    };

    dtoOut.push(employee);
  }

  return dtoOut;
}

function getEmployeeStatistics(employees) {
  let total = employees.length;

  // počty workloadov
  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  // veky
  let sumAge = 0;
  let minAge = null;
  let maxAge = null;

  // pre ženy workload
  let sumWomenWorkload = 0;
  let countWomen = 0;

  // polia na mediány
  let ages = [];
  let workloads = [];

  for (let i = 0; i < employees.length; i++) {
    let e = employees[i];

    // workload counts
    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    // age from ISO birthdate
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

  // average age (1 desatinné)
  let averageAge = sumAge / total;
  averageAge = roundTo1Decimal(averageAge);

  // min/max age (celé čísla)
  minAge = Math.round(minAge);
  maxAge = Math.round(maxAge);

  // median age (celé číslo)
  let medianAge = medianClassic(ages);
  medianAge = Math.round(medianAge);

  // median workload (dolný stred = vždy 10/20/30/40)
  let medianWorkload = medianLowerMiddle(workloads);

  // average women workload (0 ak nie sú ženy)
  let averageWomenWorkload = 0;
  if (countWomen > 0) {
    averageWomenWorkload = sumWomenWorkload / countWomen;
    averageWomenWorkload = roundTo1Decimal(averageWomenWorkload);
  }

  // sortedByWorkload (jednoduché triedenie)
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

// ===== helpery (stále jednoduché) =====

function getAgeFromIso(iso) {
  let d = new Date(iso);
  let diffMs = Date.now() - d.getTime();
  let years = diffMs / (365.25 * 24 * 60 * 60 * 1000);
  return years;
}

function roundTo1Decimal(x) {
  return Math.round(x * 10) / 10;
}

// klasický medián (pri párnom = priemer 2 stredných)
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

// medián workload = dolný stred (aby bol vždy 10/20/30/40)
function medianLowerMiddle(arr) {
  let a = arr.slice();
  a.sort(function (x, y) {
    return x - y;
  });

  let n = a.length;
  let mid = Math.floor((n - 1) / 2);
  return a[mid];
}