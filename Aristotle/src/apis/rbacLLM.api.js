import { Result } from "./resultType";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch("http://localhost:5000/load_data", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      return Result.Err(`Error uploading file: ${error.message}`);
    }
    const result = await response.json();
    return Result.Ok(result);
  } catch (error) {
    console.log(error.message, "ERROR");
    return Result.Err(`Error => ${error.message}`);
  }
}

export async function queryChat(user, query) {
  try {
    const response = await fetch("http://localhost:5000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, query }),
    });

    if (!response.ok) {
      return Result.Err(`Error uploading file: ${error.message}`);
    }

    const result = await response.json();
    return Result.Ok(result);
  } catch (error) {
    console.log(error, "Error");
    return Result.Err(`Error => ${error.message}`);
  }
}
