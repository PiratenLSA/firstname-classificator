var csv = require('ya-csv')
  , fs  = require('fs');

if (typeof process.argv[2] === 'undefined') {
  console.error('usage: ' + process.argv[0] + ' ' + process.argv[1] + ' data.csv');
  process.exit(1);
}

var filenameNamesCSV = process.argv[2];

if (!fs.existsSync(filenameNamesCSV)) {
  console.error('this file does not exists');
  process.exit(1);
}

var reader = csv.createCsvFileReader('firstnames.csv', {
    columnsFromHeader: true
  , separator: ';'
});

var firstnames = {};

reader.addListener('data', function (data) {
  firstnames[data.firstname] = data.gender;
});

reader.addListener('end', function (data) {
  var gender = {
      m: 0
    , w: 0
    , u: 0
  };

  var undefinedFirstnames = [];

  var reader2 = csv.createCsvFileReader(filenameNamesCSV);

  reader2.addListener('data', function(data) {
    var firstnameCSV = data[0];

    if (typeof firstnames[firstnameCSV] === 'undefined') {
      gender.u++;

      if (undefinedFirstnames.indexOf(firstnameCSV) == -1)
        undefinedFirstnames.push(firstnameCSV);

      return;
    }

    gender[firstnames[firstnameCSV]]++;
  });

  reader2.addListener('end', function(data) {
    console.dir(gender);

    if (undefinedFirstnames.length > 0)
      console.log('\n\nundefined: ' + undefinedFirstnames.join(', '));
  });
});

