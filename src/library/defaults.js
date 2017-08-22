export const personTypes = {
    fast: {
        name: 'fast',
        textures: {},
        move: {swimming: false, flying: false},
        level: [
            {speed: 5, health: 4, power: 2, attackRange: 3},
            {speed: 6, health: 4, power: 2, attackRange: 3},
            {speed: 7, health: 5, power: 3, attackRange: 3},
            {speed: 8, health: 6, power: 4, attackRange: 4},
        ],
        cost: [100, 200, 300, 400]
    },
    middle: {
        name: 'middle',
        textures: {},
        move: {swimming: false, flying: false},
        level: [
            {speed: 3, health: 5, power: 3, attackRange: 4},
            {speed: 4, health: 6, power: 4, attackRange: 4},
            {speed: 5, health: 7, power: 5, attackRange: 4},
            {speed: 6, health: 8, power: 6, attackRange: 5},
        ],
        cost: [175, 275, 375, 550]
    },
    strong: {
        name: 'strong',
        textures: {},
        move: {swimming: false, flying: false},
        level: [
            {speed: 2, health: 7, power: 5, attackRange: 4},
            {speed: 2, health: 8, power: 6, attackRange: 4},
            {speed: 3, health: 9, power: 7, attackRange: 4},
            {speed: 4, health: 10, power: 8, attackRange: 5},
        ],
        cost: [250, 350, 500, 700]
    },
};