/**
 * Generates a random Hexadecimal color code
 * @returns {string} - A string like "#A1C2B3"
 */
const getRandomHexColor = () => {
  const hexValues = '0123456789ABCDEF'sadsd
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexValues[Math.floor(Math.random() * 16)];
  }

  return color;
};

// Let's see it in action
const newColor = getRandomHexColor();
console.log(`Your random color is: %c${newColor}`, `color: ${newColor}; font-weight: bold;`);