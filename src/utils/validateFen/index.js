/**
 * Valida una cadena FEN.
 * @param {string} fen - La cadena FEN a validar.
 * @returns {boolean} - Devuelve true si la cadena FEN es válida, de lo contrario false.
 */
export const validateFEN = (fen) => {
  const fenParts = fen.split(' ');

  // La cadena FEN debe tener 6 partes
  if (fenParts.length !== 6) {
    return false;
  }

  const [position, turn, castling, enPassant, halfmoveClock, fullmoveNumber] =
    fenParts;

  // Validar la parte de la posición
  const rows = position.split('/');
  if (rows.length !== 8) {
    return false;
  }

  const validPieces = 'prnbqkPRNBQK';
  for (const row of rows) {
    let count = 0;
    for (const char of row) {
      if (validPieces.includes(char)) {
        count += 1;
      } else if (!isNaN(char)) {
        count += parseInt(char, 10);
      } else {
        return false;
      }
    }
    if (count !== 8) {
      return false;
    }
  }

  // Validar el turno (debe ser 'w' o 'b')
  if (turn !== 'w' && turn !== 'b') {
    return false;
  }

  // Validar el enroque (puede ser una combinación de 'KQkq' o '-')
  if (!/^(-|[KQkq]{1,4})$/.test(castling)) {
    return false;
  }

  // Validar la captura al paso (puede ser '-' o una posición válida)
  if (!/^(-|[a-h][36])$/.test(enPassant)) {
    return false;
  }

  // Validar el reloj de medio movimiento (debe ser un número entero)
  if (isNaN(halfmoveClock) || parseInt(halfmoveClock, 10) < 0) {
    return false;
  }

  // Validar el número de movimiento completo (debe ser un número entero mayor o igual a 1)
  if (isNaN(fullmoveNumber) || parseInt(fullmoveNumber, 10) < 1) {
    return false;
  }

  return true;
};
