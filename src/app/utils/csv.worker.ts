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
  return csvText.split("\n").map(row => row.split(","));
}

export function arrayToCSV(data: any[]): string {
  return data.map(row => row.join(",")).join("\n");
}
