const worker = new Worker(new URL("./csv.worker.ts", import.meta.url));

export async function fileToCSV(event: any): Promise<string> {
    const file: File = event.target.files[0];
    const content = await file.text();
    return content;
}

export async function fileToCSVToArray(event: any): Promise<any[]> {
    const content = await fileToCSV(event);
    worker.postMessage({ action: "CSVToArray", arg: content });
    return new Promise((resolve, reject) => {
        worker.onmessage = ({ data }) => resolve(data);
        worker.onerror = (error) => reject(error);
    });
}

export function CSVToFile(name: string, csvContent: string) {
    const el = document.createElement("a");
    el.href = "data:text/csv;charset=utf-8," + encodeURI(csvContent);
    el.target = "_blank";
    el.download = name + ".csv";
    el.click();
}

export function arrayToCSVToFile(name: string, array: any[]) {
    worker.postMessage({ action: "arrayToCSV", arg: array });
    worker.onmessage = ({ data }) => CSVToFile(name, data);
    worker.onerror = (error) => console.error(error);
}