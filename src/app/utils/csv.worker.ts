/// <reference lib="webworker" />

addEventListener("message", ({ data }) => {

  const { action, arg } = data as { action: string, arg: any };

  if (!action || !arg) {
    throw new Error("Missing action/argument.");
  }

  if (action === "arrayToCSV" && Array.isArray(data.arg)) {
    return postMessage(arrayToCSV(data.arg));
  }

  if (action === "CSVToArray" && typeof data.arg === "string") {
    return postMessage(CSVToArray(data.arg));
  }

  throw new Error("Could not execute.");
});

export function CSVToArray(csvText: string): any[] {
  const dataRows = csvText.slice(csvText.indexOf("\n") + 1).split("\n");
  return dataRows.map((row) => row.split(","));
}

export function arrayToCSV(data: any[]): string {

  if (data.length == 0) return "";

  const propertyNames = Object.keys(data[0]);
  const rowWithPropertyNames = propertyNames.join(",") + "\n";

  const rows: string[] = [];
  data.forEach((item) => {

    const values: string[] = [];
    propertyNames.forEach((key) => {
      let val: any = item[key];
      val = (val !== undefined && val !== null) ? new String(val) : "";
      values.push(val);
    });

    rows.push(values.join(","));
  });

  let csvContent = rowWithPropertyNames;
  csvContent += rows.join("\n");

  return csvContent;
}
