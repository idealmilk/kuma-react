import axios from "axios";
import pdf from "pdf-parse";
import { Sightings } from "./sightings.interface";

let yamanashiSightings: Sightings = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [138.58451476940795, 35.68138811867073],
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [138.39088074689244, 35.7767052561454],
      },
    },
  ],
};

const pdfUrl =
  "https://www.pref.yamanashi.jp/documents/61009/231120mokugeki.pdf";

const scrapePDF = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const data = response.data;

    const parsedPDF = await pdf(data);

    console.log(parsedPDF);

    const entries = parsedPDF.text
      .split("\n")
      .filter((entry) => entry.trim() !== "");

    entries.shift();

    const groupedArrays = [];
    let tempArray = [];

    for (const entry of entries) {
      if (entry.includes("2023/")) {
        if (tempArray.length > 0) {
          groupedArrays.push(tempArray);
          tempArray = [];
        }
      }
      tempArray.push(entry);
    }

    if (tempArray.length > 0) {
      groupedArrays.push(tempArray);
    }

    let transformedArrays;

    groupedArrays.forEach((item) => {
      const weatherTypes = ["晴れ", "雨", "曇り"];
      const firstLineWords = item[0].match(/\S+/g);

      const removeSectionFromArrayElements = (
        inputString: string,
        arrayToRemove: string[]
      ) => {
        let removedString = "";

        // Iterate through each element in the array
        arrayToRemove.forEach((item) => {
          // Create a regular expression to match the item in the array
          const regex = new RegExp(item, "g");
          // Replace the matched item with an empty string and append to removedString
          removedString += inputString.match(regex)
            ? inputString.match(regex).join("")
            : "";
          inputString = inputString.replace(regex, "");
        });

        return {
          stringWithoutSections: inputString,
          removedSections: removedString,
        };
      };

      const { stringWithoutSections, removedSections } =
        removeSectionFromArrayElements(
          firstLineWords[4] ? firstLineWords[4] : item[2],
          weatherTypes
        );

      const parsedData = {
        id: firstLineWords[0],
        date: firstLineWords[1],
        time: firstLineWords[2],
        area: firstLineWords[3] ? firstLineWords[3] : item[1],
        address: stringWithoutSections,
        weather: removedSections,
      };

      console.log(parsedData);
    });
  } catch (error) {
    console.error("Error fetching or parsing PDF:", error);
  }
};

// Call the function to scrape the PDF
scrapePDF(pdfUrl);

export const findAll = async (): Promise<Sightings> => yamanashiSightings;

// const x = {
//  id: 1,
//  date: "2023/4/5",
//  time: "14:05頃",
//  area: "都留市",
//  address: "田野倉地内",
//  weather: "晴れ"
// }
