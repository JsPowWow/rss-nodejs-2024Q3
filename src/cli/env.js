/**
 * @description The function that parses environment variables with prefix `RSS_` and prints them to the console
 * in the format `RSS_name1=value1; RSS_name2=value2`.
 */
const parseEnv = () => {
    console.log(
        Object.entries(process.env)
            .filter(([envName]) => envName.startsWith("RSS_"))
            .map(([envName, envValue]) => `${envName}=${envValue}`)
            .join("; ")
    );
};

parseEnv();