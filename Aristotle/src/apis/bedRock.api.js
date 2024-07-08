import { Result } from "./resultType";
import axios from "axios";

const config = {
  api: "http://localhost:5004",
};

export const queryBedRock = async (data) => {
  try {
    let response = await axios.get(`${config.api}/bedrock/${data}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return Result.Ok(response.data.completion);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return Result.Err(`Error => ${error.response?.data || error.message}`);
    }
    return Result.Err(`Error => ${error.message}`);
  }
};
