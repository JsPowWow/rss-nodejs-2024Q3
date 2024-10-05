import process from "node:process";
import os from "node:os";

const getUserNameFromProcessArgs = () =>
    process.argv.slice(2)
        .find((arg) => arg.startsWith("--username"))
        ?.split("=")
        [1];

const getUserNameFromOs = () => os.userInfo().username;

export const getUserName = () => getUserNameFromProcessArgs() ?? getUserNameFromOs();
