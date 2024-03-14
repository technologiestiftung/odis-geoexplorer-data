module.exports = async function fetchWfsAsText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.text(); // Converts the response to text
  return data; // Return the WFS response as a string
};
