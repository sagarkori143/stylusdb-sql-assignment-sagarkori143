const parseQuery = require("./queryParser");
const readCSV = require("./csvReader");

async function executeSELECTQuery(query) {
  const { fields, table, whereClauses } = parseQuery(query);
  const data = await readCSV(`${table}.csv`);

  // Apply WHERE clause filtering with proper operator handling
  const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
        : data;

  function evaluateCondition(row, clause) {
    const { field, operator, value } = clause;
    switch (operator) {
      case "=":
        return row[field] === value;
      case "!=":
        return row[field] !== value;
      case ">":
        return row[field] > value;
      case "<":
        return row[field] < value;
      case ">=":
        return row[field] >= value;
      case "<=":
        return row[field] <= value;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  // Selecting the specified fields
  return filteredData.map((row) => {
    const selectedRow = {};
    fields.forEach((field) => {
      selectedRow[field] = row[field];
    });
    return selectedRow;
  });
}

module.exports = executeSELECTQuery;
