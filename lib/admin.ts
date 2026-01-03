export const ADMIN_EMAIL = 'cacancihan@gmail.com';

export const GOLDEN_ASSET_IDS = [
  0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 21, 22, 23, 24, 25, 27, 28, 29, 33, 34, 39, 42, 45, 49, 50,
  51, 52, 55, 56, 63, 66, 67, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
  91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 111, 123, 131, 144, 168, 188, 198, 200, 222, 234, 246, 300, 333, 345,
  360, 365, 404, 444, 456, 500, 520, 555, 600, 666, 700, 777, 800, 888, 900, 999, 1000, 1010, 1024, 1080, 1111, 1234,
  1313, 1314, 1337, 1402, 1500, 1665, 1889, 1984, 2000, 2020, 2024, 2222, 2345, 2468, 3000, 3333, 3456, 3600, 3650, 4040,
  4444, 4567, 5000, 5050, 5200, 5555, 6000, 6666, 7000, 7070, 7777, 8000, 8080, 8888, 9000, 9090, 9999, 10000, 10101,
  10800, 11111, 12345, 13131, 13337, 15000, 18889, 20000, 20202, 22222, 23456, 24680, 30000, 33333, 34567, 36000,
  36500, 40404, 44444, 45678, 50000, 50505, 52013, 55555, 60000, 66666, 70000, 70707, 77777, 80000, 80808, 88888,
  90000, 90909, 99999, 100000, 101010, 108000, 111111, 123456, 131313, 133337, 150000, 188889, 200000, 202020, 222222,
  234567, 246801, 300000, 333333, 345678, 360000, 365000, 404040, 444444, 456789, 500000, 505050, 520131, 555555,
  600000, 666666, 700000, 707070, 777777, 800000, 808080, 888888, 900000, 909090, 999999, 1000000
];

export function isAdmin(email: string | undefined): boolean {
  return email === ADMIN_EMAIL;
}

export const FAKE_NAMES = [
  'Emma & Liam Smith', 'Olivia & Noah Johnson', 'Ava & Oliver Williams', 'Isabella & Elijah Brown',
  'Sophia & Lucas Jones', 'Mia & Mason Garcia', 'Charlotte & Logan Martinez', 'Amelia & Ethan Rodriguez',
  'Wei & Li Wang', 'Xiu & Chen Zhang', 'Mei & Jun Liu', 'Ying & Ming Yang', 'Hui & Gang Wu',
  'Marie & Pierre Dupont', 'Sophie & Jean Martin', 'Claire & Luc Bernard', 'Isabelle & Michel Dubois',
  'Camille & Antoine Rousseau', 'Yuki & Takeshi Tanaka', 'Sakura & Hiroshi Suzuki', 'Hana & Kenji Watanabe',
  'Aiko & Ryo Yamamoto', 'Anna & Ivan Ivanov', 'Maria & Dmitri Petrov', 'Elena & Alexei Sidorov',
  'Fatima & Ahmed Al-Rashid', 'Layla & Omar Hassan', 'Zara & Karim Al-Malik', 'Amira & Youssef Ibrahim',
  'Giulia & Marco Rossi', 'Francesca & Luca Romano', 'Chiara & Alessandro Ferrari', 'Sofia & Matteo Esposito',
  'Carmen & Carlos García', 'Lucia & Javier Rodríguez', 'Elena & Miguel Fernández', 'Ana & Pablo López',
  'Laura & David Silva', 'Julia & Daniel Santos', 'Lena & Max Müller', 'Hannah & Felix Schmidt',
  'Mila & Leon Fischer', 'Emma & Paul Wagner', 'Sarah & Tom Becker', 'Lisa & Jan Hoffmann',
  'Chloe & Jack Anderson', 'Emily & Harry Taylor', 'Grace & Oscar Thomas', 'Lily & Charlie Jackson',
  'Ruby & George White', 'Ella & William Harris', 'Alice & James Martin', 'Lucy & Benjamin Thompson',
];

export function generateRandomMessage(): string {
  const messages = [
    'Love Forever',
    'Paris 2024',
    'J & M',
    'Eternal Love',
    'Pour la vie',
    'Our Trip',
    'Locked',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
