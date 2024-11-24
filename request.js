const apiKey = "ppR4S3ZFqbyEWbPhM7PN3INVNBmby5v4LNyC8nt7";

export async function getComida(nombreAlimento) {
  try {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${nombreAlimento}&api_key=${apiKey}`
    );
    const alimentos = await res.json();
    return alimentos;
  } catch (error) {
    console.error(error);
  }
}
