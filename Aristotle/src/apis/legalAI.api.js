import { Result } from "./resultType";
import axios from "axios";

const config = {
  api: "http://localhost:5005",
};

export const queryLegalAI = async (data) => {
  try {
    const response = await fetch("http://localhost:5005/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      return Result.Err(`Error uploading file: ${error.message}`);
    }

    const result = await response.json();
    console.log("Response:"+result);
    return Result.Ok(result);
  } catch (error) {
    console.log(error, "Error");
    return Result.Err(`Error => ${error.message}`);
  }
};
