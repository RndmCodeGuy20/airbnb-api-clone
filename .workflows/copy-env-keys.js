import * as fs from "fs";

// Read the .env.local file from the root of the project
const envContent = fs.readFileSync("./.env.local", "utf-8");
const envLines = envContent.split("\n");

let exEnvData = [];
let devEnvData = [];
envLines.forEach((line) => {
	const [key, value] = line.split("=");
	// console.log(key, value);
	if (key && value) {
		exEnvData.push(`${key}=`);
		if (key === "NODE_ENV") {
			devEnvData.push(`${key}=production`);
			return;
		}
		devEnvData.push(`${key}=${value}`);
	} else if (key) {
		exEnvData.push(key);
		devEnvData.push(key);
	} else {
		exEnvData.push("");
		devEnvData.push("");
	}
});

// Write the .env.local file to the root of the project
fs.writeFileSync("./.env.example", exEnvData.join("\n"));
fs.writeFileSync("./.env", devEnvData.join("\n"));
