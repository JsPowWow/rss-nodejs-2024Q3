import {isEvenNumber} from "#utils";

/**
 * @description The function that parses command line arguments (given in format `--propName value --prop2Name value2` (without any validation)
 * and prints them to the console in the format `propName is value, prop2Name is value2`
 */
const parseArgs = () => {
    console.log(
        Object.entries(process.argv)
            .filter((_, idx) => idx > 1)
            .reduce((acc, args, currentIndex, array) => {
                if (isEvenNumber(currentIndex)) {
                    acc.push([args[1], array[currentIndex+1][1]])
                }
                return acc;
            }, [])
            .map(([propName, propValue]) => `${propName.substring(2)} is ${propValue}`)
            .join(", ")
    )
};

parseArgs();