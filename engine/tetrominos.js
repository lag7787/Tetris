export const TETROMINOS = {
  I: {
      shape: [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0]],
    color: 1,
  },
  J: {
       shape: [
                [0, 'J', 0],
                [0, 'J', 0],
                ['J', 'J', 0]],
       color: 2,
      },
  L: {
      shape: [ 
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L']],
      color: 3,
  },
  O: {
    shape: [
            ['O', 'O'],
            ['O', 'O']],
    color: 4,
  },
  S: {
      shape: [
              [0, 'S', 'S'],
              ['S', 'S', 0],
              [0, 0, 0]],
      color: 5,
    },
  T: {
    shape: [
            [0, 0, 0],
            ['T', 'T', 'T'],
            [0, 'T', 0]],
    color: 6,
  },
  Z: { shape: [
                ['Z', 'Z', 0],
                [0, 'Z', 'Z'], 
                [0, 0, 0]],
       color: 7,
       },
};


export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};